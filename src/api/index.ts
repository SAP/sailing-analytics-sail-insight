import { getApiServerUrl } from 'api/config'
import resources from 'api/endpoints/resources'


export { default as authApi } from 'api/endpoints/auth'
export const dataApi = resources
export const selfTrackingApi = resources(getApiServerUrl())
