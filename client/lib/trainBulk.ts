import type { AxiosInstance } from "axios";
import type { LabeledExample } from "../types";

export const trainBulk = async (client: AxiosInstance, examples: LabeledExample[]) => {
  await client.post<void>('/train_bulk', examples)
}
