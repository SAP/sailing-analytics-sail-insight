import { last } from 'lodash'
import * as RNFS from 'react-native-fs'

export const saveFile = async (data: string, filename: string) => {
  const documentDir = RNFS.DocumentDirectoryPath
  const dir = last(documentDir) !== '/' ? `${documentDir}/` : documentDir
  const path = `${dir}${filename}`

  // Base64 is used for raw data
  await RNFS.writeFile(path, data, 'base64')

  return path
}
