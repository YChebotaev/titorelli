import { type FC } from "react";
import { ProfileAccountRoles } from "@/types/my-profile";
import { LeaveButton } from "./leave-button";

export const AccountItem: FC<{
  id: string;
  name: string;
  ownerId: string;
  ownerUsername: string;
  role: ProfileAccountRoles;
}> = ({ id, name, ownerId, ownerUsername, role }) => (
  <div className="bg-background p-4 rounded-md flex items-center justify-between">
    <div className="grid grid-cols-3 gap-4 flex-grow">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Name</p>
        <p className="font-medium">{name}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Owner</p>
        <p>{ownerUsername}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Role</p>
        <p className="capitalize">{role}</p>
      </div>
    </div>
    <div className="flex space-x-2 ml-4">
      {/* <Button
          variant="outline"
          size="sm"
          // onClick={() => requestRoleChange(account.id)}
        >
          Request Role Change
        </Button> */}
      <LeaveButton accountId={id} ownerId={ownerId} owner={role === "owner"} />
    </div>
  </div>
);
