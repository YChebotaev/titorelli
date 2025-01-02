import { getAccounts } from "@/server-actions/my-profile/get-accounts";
import { AddAccountBtn } from "@/components/my-profile/create-account-btn";
import { EmptyState } from "@/components/my-profile/empty-state";
import { AccountItem } from "./account-item";

export async function AccountsList() {
  const accounts = await getAccounts();

  return (
    <div className="bg-muted p-6 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Аккаунты</h3>
        <div className="space-y-4">
          {accounts.length === 0 && (
            <EmptyState
              title="Нет аккаунтов"
              subtitle="Вы не являетесь участником ни одного аккаунта"
            />
          )}
          {accounts.map(({ id, name, owner, role }) => (
            <AccountItem
              key={id}
              id={id}
              name={name}
              ownerId={owner.id}
              ownerUsername={owner.username}
              role={role}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <AddAccountBtn />
      </div>
    </div>
  );
}
