"use client";

import { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useGetAccountMembers } from "@/hooks/use-get-account-members";

export const AccountMemberSelector: FC<{
  accountId: string;
  skipMember?: string;
  name: string;
}> = ({ accountId, skipMember, name }) => {
  const { data, isLoading } = useGetAccountMembers(accountId);

  if (isLoading)
    return (
      <Select name={name}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите участника аккаунта" />
        </SelectTrigger>
      </Select>
    );

  let members = data;

  if (skipMember != null) {
    members = data?.filter(({ id }) => id !== skipMember);
  }

  return (
    <Select name={name}>
      <SelectTrigger>
        <SelectValue placeholder="Выберите участника аккаунта" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {(!members || members.length === 0) && (
            <SelectLabel>Вы единственный участник</SelectLabel>
          )}
          {members?.map(({ id, username }) => (
            <SelectItem key={id} value={id}>
              {username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
