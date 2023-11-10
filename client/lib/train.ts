import type { AxiosInstance } from "axios";
import type { UnlabeledExample } from "../types";

export const train = async (client: AxiosInstance, example: UnlabeledExample) => {
  await client.post<void>('/train', example)
}
