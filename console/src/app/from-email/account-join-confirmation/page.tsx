import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getEmailService,
  getInviteService,
  getTokenService,
} from "@/lib/server/services/instances";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { maskNumber } from "@/lib/server/keymask";
import { AccountInvite } from "@prisma/client";

const getPageData = async (token: string) => {
  const emailService = getEmailService();
  const inviteService = getInviteService();

  if (!(await emailService.validateAccountJoinTokenFromEmail(token)))
    throw new Error("Token invalid or expired");

  const user = await getUserInPage();

  const [account, invite] =
    await inviteService.getAccountAndInviteFromAccountJoinTokenFromEmail(token);

  if (!account) throw new Error(`Can't get account from token = "${token}"`);

  const accountName = account.name;

  const isRegistered =
    user != null && invite?.userId != null ? user.id === invite.userId : false;

  return { isRegistered, accountName, account, invite };
};

const createSignupHref = async (invite: AccountInvite | null) => {
  if (invite == null) return "/authorization/signup";

  const url = new URL("/authorization/signup", "https://example.com");
  let setNoAccount = false;

  if (invite.email) {
    url.searchParams.set("email", invite.email);

    setNoAccount = true;
  }

  if (invite.phone) {
    url.searchParams.set("phone", invite.phone);

    setNoAccount = true;
  }

  if (invite.username) {
    url.searchParams.set("username", invite.username);

    setNoAccount = true;
  }

  if (setNoAccount) {
    url.searchParams.set("account", "no_account");
  }

  if (url.searchParams.size > 0) {
    const tokenService = getTokenService();

    url.searchParams.set(
      "v",
      await tokenService.generateSignupPrefilledValidationToken(
        url.searchParams,
      ),
    );
  }

  return url.pathname + (url.search ? url.search : "");
};

export default async function AccountJoinConfirmationPage(props: {
  searchParams: Promise<{ t: string }>;
}) {
  const inviteService = getInviteService();
  const token = (await props.searchParams).t;
  const { isRegistered, accountName, account, invite } =
    await getPageData(token);

  if (isRegistered && invite) {
    await inviteService.joinRegisteredUserToAccount(invite);
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Подтверждение присоединения к аккаунту
          </CardTitle>
          <CardDescription>
            {isRegistered
              ? "Вы успешно присоединились к аккаунту"
              : "Для завершения процесса необходима регистрация"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRegistered ? (
            <div>
              <p>
                Вы успешно присоединились к аккаунту &apos;{accountName}&apos;.
                Теперь вы можете пользоваться всеми услугами, связанными с этим
                аккаунтом.
              </p>
              <div className="mt-4">
                <Link href={`/accounts/${maskNumber(account.id)}`}>
                  <Button>Перейти в аккаунт</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p>
                Для завершения процесса присоединения к аккаунту &apos;
                {accountName}&apos;, вам необходимо зарегистрироваться.
              </p>
              <div className="mt-4">
                <Link href={await createSignupHref(invite)}>
                  <Button>Зарегистрироваться</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
