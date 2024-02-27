import type { AxiosInstance } from "axios";
import { Prediction, type UnlabeledExample } from "../types";

export const predict = async (client: AxiosInstance, example: UnlabeledExample) => {
  const { data } = await client.post<Prediction>('/predict', example)

  return data
}
