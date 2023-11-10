import type { AxiosInstance } from "axios";
import type { LabeledExample } from "../types";

export const train = async (client: AxiosInstance, example: LabeledExample) => {
  await client.post<void>('/train', example)
}
