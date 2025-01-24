import { Sidebar } from "@/components/accounts/sidebar";
import { AccountShellLayout } from "@/layouts/account-shell-layout";

export default async function AccountPage({}: {
  params: Promise<{ accountId: string }>;
}) {
  return (
    <AccountShellLayout sidebar={<Sidebar active="dashboard" />}>
      Hello, world!
    </AccountShellLayout>
  );
}
