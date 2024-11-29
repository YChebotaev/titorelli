export type MethodTypes = 'trainBulk'

export type RpcRequest<P extends any[]> = {
  id: number
  method: MethodTypes
  params: P
}

export type RpcResponse<R, E = never> = {
  id: number
  result?: R
  error?: E
}
