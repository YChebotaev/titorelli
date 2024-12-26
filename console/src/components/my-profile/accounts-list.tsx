"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Account {
  id: string;
  name: string;
  ownerUsername: string;
  role: "viewer" | "editor" | "owner" | "invited";
}

export default function AccountsList({
  initialAccounts,
}: {
  initialAccounts: Account[];
}) {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);

  const leaveAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const requestRoleChange = (id: string) => {
    // Here you would typically send a request to your backend
    console.log(`Requesting role change for account ${id}`);
  };

  return (
    <div className="bg-muted p-6 rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Accounts</h3>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-background p-4 rounded-md flex items-center justify-between"
            >
              <div className="grid grid-cols-3 gap-4 flex-grow">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="font-medium">{account.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Owner
                  </p>
                  <p>{account.ownerUsername}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <p className="capitalize">{account.role}</p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => requestRoleChange(account.id)}
                >
                  Request Role Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => leaveAccount(account.id)}
                >
                  Leave
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
