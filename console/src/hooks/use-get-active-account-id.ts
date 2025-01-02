import { useContext } from "react"
import { context } from "@/components/active-account-id-provider"

export const useGetActiveAccountId = () => {
  const id = useContext(context)

  return id
}
