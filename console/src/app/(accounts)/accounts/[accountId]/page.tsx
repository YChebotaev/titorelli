import { AccountShellLayout } from "@/layouts/account-shell-layout";

export default async function AccountPage({}: {
  params: Promise<{ accountId: string }>;
}) {
  return <AccountShellLayout>Hello, world!</AccountShellLayout>;
}
