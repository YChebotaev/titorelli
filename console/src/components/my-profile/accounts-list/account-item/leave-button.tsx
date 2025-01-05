"use client";

import { useActionState, useId, useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldHelp } from "@/components/form/field-help";
import { AccountMemberSelector } from "@/components/form/account-member-selector";
import { useGetAccountMembers } from "@/hooks/use-get-account-members";
import { cn } from "@/lib/utils";
import { leaveAccount } from "@/server-actions/my-profile/leave-account";
import { leaveFormInitialState } from "@/constants";

export type LeaveIntents = "new_owner" | "wipe";

export type LeaveFormState = {
  success: boolean | null;
  errors: {
    itent?: string;
    new_owner_id?: string;
    account_id?: string;
  };
};

const LeaveButtonInternal: FC<{
  accountId: string;
  ownerId: string;
  owner: boolean;
  singleMember: boolean;
}> = ({ accountId, ownerId, owner, singleMember }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [intentValue, setIntentValue] = useState<LeaveIntents>(
    singleMember ? "wipe" : "new_owner",
  );
  const formId = useId();
  const [{ success, errors }, formAction] = useActionState<LeaveFormState>(
    leaveAccount,
    leaveFormInitialState,
  );

  if (!owner) {
    return (
      <Button variant="destructive" size="sm" className="font-bold">
        Покинуть
      </Button>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="font-bold"
          onClick={setDialogOpen.bind(null, true)}
        >
          Покинуть
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены?</DialogTitle>
          <DialogDescription>
            Вы хотите полностью удалить или покинуть аккаунт, назначив нового
            владельца?
          </DialogDescription>
        </DialogHeader>
        {success && <div>Аккаунт удален</div>}
        {!success && (
          <form id={formId} action={formAction}>
            <input type="hidden" name="account_id" value={accountId} />
            <div className="grid gap-2">
              <RadioGroup
                name="intent"
                defaultValue={intentValue}
                onValueChange={(value) => setIntentValue(value as LeaveIntents)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    disabled={singleMember}
                    value="new_owner"
                    id="r1"
                    className={cn(
                      singleMember &&
                        "text-gray-400 cursor-not-allowed opacity-50",
                    )}
                  />
                  <Label
                    className={cn(
                      "flex gap-1",
                      singleMember && "text-muted-foreground",
                    )}
                    htmlFor="r1"
                  >
                    Назначить нового владельца
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wipe" id="r2" />
                  <Label className="flex gap-1" htmlFor="r2">
                    Полностью удалить аккаунт
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              {intentValue === "new_owner" && (
                <FieldHelp>
                  Указанный пользователь получит права владельца аккаунта, а вы
                  получите права редактора в этом аккаунте. С правами редактора
                  можно будет выйти из проекта
                </FieldHelp>
              )}
              {intentValue === "wipe" && (
                <FieldHelp>
                  Аккаунт будет полностью удален вместе со всеми данными.
                  {!singleMember &&
                    "Участникам будет разослано уведомление об этом."}
                </FieldHelp>
              )}
            </div>
            {intentValue === "new_owner" && (
              <div className="grid gap-2">
                <AccountMemberSelector
                  skipMember={ownerId}
                  name="new_owner_id"
                  accountId={accountId}
                />
              </div>
            )}
          </form>
        )}
        <DialogFooter>
          <Button type="submit" form={formId} variant="destructive">
            Подтвердить
          </Button>
          <Button variant="outline" onClick={setDialogOpen.bind(null, false)}>
            Отмена
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const LeaveButton: FC<{
  accountId: string;
  ownerId: string;
  owner: boolean;
}> = (props) => {
  const { accountId, ownerId } = props;
  const { data, isLoading } = useGetAccountMembers(accountId);
  const singleMemberOwner =
    (data ?? []).filter(({ id }) => id !== ownerId).length === 0;

  return isLoading ? (
    <Button variant="destructive" size="sm" className="font-bold">
      Покинуть
    </Button>
  ) : (
    <LeaveButtonInternal {...props} singleMember={singleMemberOwner} />
  );
};
