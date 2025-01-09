import { AnonymousHeader } from "@/components/site/header";
import { FromEmailLayout } from "@/layouts/from-email-layout";
import { getUserService } from "@/lib/server/services/instances";
import { z } from "zod";

const searchParamsSchema = z.object({
  t: z.string().nonempty(),
});

export default async function EmailConfirmationPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ t: string }>;
}) {
  const { t: token } = searchParamsSchema.parse(await searchParamsPromise);

  if (!token) throw new Error("Confirmation token not provided");

  const userService = getUserService();

  await userService.markEmailConfirmedByToken(token);

  return (
    <FromEmailLayout
      title="Адрес электронной почты подтвержден"
      description="Спасибо за регистрацию. Теперь вы можете восстановить пароль на этот email."
      confirmText={null}
      confirmButtonText="Вернуться в профиль"
      confirmButtonHref="/my/profile"
      headerNode={<AnonymousHeader />}
    />
  );
}
