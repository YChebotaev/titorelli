import { TitorelliClient, TitorelliClientConfig } from "./TitorelliClient";

export const createClient = (conf: TitorelliClientConfig) => {
  return new TitorelliClient(conf)
}
