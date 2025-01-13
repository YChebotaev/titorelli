export type Labels = 'spam' | 'ham'

export type ReasonTypes =
  | 'classifier'
  | 'duplicate'
  | 'totem'
  | 'cas'

export type LabeledExample = {
  label: Labels
  text: string
}

export type UnlabeledExample = {
  text: string
}

export type Prediction = {
  reason: ReasonTypes
  value: Labels
  confidence: number
}

export type CasPrediction = {
  banned: boolean
}

export type AuthenticationResult = {
  access_token: string
  token_type: string
  scope: string
}
