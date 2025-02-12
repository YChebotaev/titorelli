import { AccountShellLayout } from "@/layouts/account-shell-layout";
import { Sidebar } from "@/components/account/sidebar";
import { getUserInPage } from "@/lib/server/get-user-in-page";
import { ModelsList } from "@/components/account/models";
import { Suspense } from "react";
import { ModelsSkeleton } from "@/components/account/models/models-skeleton";

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
      sidebar={<Sidebar accountId={accountId} active="models" />}
    >
      <Suspense fallback={<ModelsSkeleton />}>
        <ModelsList />
      </Suspense>
    </AccountShellLayout>
  );
}
