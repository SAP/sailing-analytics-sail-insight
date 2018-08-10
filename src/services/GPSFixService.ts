import { writeGPSFixRequest } from 'storage'


const storeGPSFix = (serverUrl: string, gpsFix: any) => writeGPSFixRequest(serverUrl, gpsFix)

export default {
  storeGPSFix,
}
