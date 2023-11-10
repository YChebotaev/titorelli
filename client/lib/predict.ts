import type { AxiosInstance } from "axios";
import { Prediction, type LabeledExample } from "../types";

export const predict = async (client: AxiosInstance, example: LabeledExample) => {
  const { data } = await client.post<Prediction>('/predict', example)

  return data
}
