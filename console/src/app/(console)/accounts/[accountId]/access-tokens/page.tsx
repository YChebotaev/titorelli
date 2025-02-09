import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { Sidebar } from "@/components/account/sidebar";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { AccessTokens } from "@/components/account/access-tokens";
import { Suspense } from "react";
import { SkeletonTokenList } from "@/components/account/access-tokens/skeleton-token-list";

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
      sidebar={<Sidebar accountId={accountId} active="access-tokens" />}
    >
      <Suspense fallback={<SkeletonTokenList />}>
        <AccessTokens />
      </Suspense>
    </AccountShellLayout>
  );
}
