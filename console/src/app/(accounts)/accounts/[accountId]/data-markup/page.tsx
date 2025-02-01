import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { Sidebar } from "@/components/account/sidebar";
import { AccountDataMarkup } from "@/components/account/account-data-markup";
import { getUserInPage } from "@/lib/server/get-user-in-page";

export default async function DataMarkupPage({
  params: paramsPromise,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await paramsPromise;

  const user = getUserInPage();

  if (!user) throw new Error("Not authenticated");

  return (
    <AccountShellLayout
      sidebar={<Sidebar accountId={accountId} active="data-markup" />}
    >
      <AccountDataMarkup />
    </AccountShellLayout>
  );
}
