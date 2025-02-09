import { AccountDashboard } from "@/components/account/account-dashboard";
import { Sidebar } from "@/components/account/sidebar";
import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { getUserInPage } from "@/lib/server/get-user-in-page";

export default async function AccountPage({
  params: paramsPromise,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await paramsPromise;

  const user = getUserInPage();

  if (!user) throw new Error("Not authenticated");

  return (
    <AccountShellLayout
      sidebar={<Sidebar accountId={accountId} active="dashboard" />}
    >
      <AccountDashboard />
    </AccountShellLayout>
  );
}
