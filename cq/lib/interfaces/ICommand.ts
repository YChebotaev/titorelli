export interface ICommand<Params extends Record<string, unknown>> {
  execute(params: Params): Promise<void>
}
