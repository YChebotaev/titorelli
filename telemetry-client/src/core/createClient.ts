import { TitorelliTelemetryClient, type TitorelliTelemetryClientConfig } from "../lib/TitorelliTelemetryClient";

export const createClient = (clientConf: TitorelliTelemetryClientConfig) => {
  return new TitorelliTelemetryClient(clientConf)
}
