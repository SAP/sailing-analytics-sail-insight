export const getDataUriOrPath = (imageData: any) => {
  if (imageData === undefined) {
    return undefined
  }

  const { mime, data, path } = imageData
  const uri = (mime && data) ?  `data:${mime};base64,${data}` : path

  return uri
}
