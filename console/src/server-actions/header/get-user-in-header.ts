'use server'

import { getUserInPage } from "@/lib/server/get-user-in-page"
import { maskNumber } from "@/lib/server/keymask"
import { HeaderUserVm } from "@/types/header"

export const getUserInHeader = async () => {
  const user = await getUserInPage()

  return {
    id: maskNumber(user.id),
    name: 'ychebotaev',
    email: 'hello@world.com',
  } as HeaderUserVm
}
