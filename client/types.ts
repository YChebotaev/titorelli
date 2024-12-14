export type Labels = 'spam' | 'ham'

export type LabeledExample = {
  label: Labels
  text: string
}

export type UnlabeledExample = {
  text: string
}

export type Prediction = {
  value: Labels
  confidence: number
}

export type ClientScopes =
  | 'predict'
  | 'train'
  | 'train_bulk'
  | 'exact_match/train'
  | 'cas/train'
