import { TelemetryClient, type TelemetryClientConfig } from "./TelemetryClient";

export const createClient = (clientConf: TelemetryClientConfig) => {
  return new TelemetryClient(clientConf)
}
