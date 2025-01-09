import { activeAccountCookueName } from "@/constants";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export const getMaskedActiveAccountId = async (user: User | null | undefined) => {
  const c = await cookies();
  return user
    ? (c.get(activeAccountCookueName)?.value ?? null)
    : null;
}
