import type { Prediction } from '@titorelli/client'
import type { TitorelliTelemetryClient } from '../lib/TitorelliTelemetryClient'

export const trackPrediction = async (client: TitorelliTelemetryClient, tgMessageId: number, prediction: Prediction) => {
  await client.trackPrediction(tgMessageId, prediction)
}
