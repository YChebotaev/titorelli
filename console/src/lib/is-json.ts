export const isJson = (str: string) => {
  try {
    JSON.parse(str)

    return true
  } catch (e: unknown) {
    new SuppressedError(e, true)

    return false
  }
}
