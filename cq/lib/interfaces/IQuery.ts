export interface IQuery<Params extends Record<string, unknown>> {
  execute(params: Params): Promise<void>
}
