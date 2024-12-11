export const scopeGuard = (clientId: string, modelId: string, scopeSuffix: string, actualScopes: string[]) => {
  const finalScope = `${modelId}_${scopeSuffix}`

  if (!actualScopes.includes(finalScope))
    throw new Error(`Client with id = '${clientId}' don't have scope ${finalScope} for this operation`)

  return true
}
