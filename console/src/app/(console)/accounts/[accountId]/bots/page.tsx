import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { Sidebar } from "@/components/account/sidebar";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { BotList, BotListSkeleton } from "@/components/account/bots";
import { Suspense } from "react";

export default async function DataMarkupPage({
  params: paramsPromise,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await paramsPromise;

  const user = await getUserInPage();

  if (!user) throw new Error("Not authenticated");

  return (
    <AccountShellLayout
      sidebar={<Sidebar accountId={accountId} active="bots" />}
    >
      <Suspense fallback={<BotListSkeleton />}>
        <BotList />
      </Suspense>
    </AccountShellLayout>
  );
}
