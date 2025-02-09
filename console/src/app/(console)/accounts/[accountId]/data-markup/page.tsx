import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { Sidebar } from "@/components/account/sidebar";
import { AccountDataMarkup } from "@/components/account/account-data-markup";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { FolderTypes } from "@/types/data-markup";

export default async function DataMarkupPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ folder?: FolderTypes; chat?: string }>;
}) {
  const { folder = "by-chat", chat } = await searchParamsPromise;
  const { accountId } = await paramsPromise;

  const user = await getUserInPage();

  if (!user) throw new Error("Not authenticated");

  return (
    <AccountShellLayout
      sidebar={<Sidebar accountId={accountId} active="data-markup" />}
    >
      <AccountDataMarkup activeChat={chat} activeFolder={folder} />
    </AccountShellLayout>
  );
}
