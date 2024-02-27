export const toChunks = <T>(arr: T[], chunkSize: number) => {
  const chunks: T[][] = []

  for (let i=0; i<arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)

    chunks.push(chunk)
  }

  return chunks
}
