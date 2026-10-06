import { getApiServerUrl, getSecurityGenerator, HttpMethods } from 'api/config'
import { dataRequest, request } from 'api/handler'
import AuthException from 'api/AuthException'
import { LOGIN_FALLBACK_SERVER_URLS } from 'environment/init'
import { isEmpty, uniq } from 'lodash'
import {
  ApiAccessToken,
  User,
} from 'models'
import { mapResToAccessTokenData } from 'models/ApiAccessToken'
import { mapResToUser } from 'models/User'

export interface SecurityApi {
  user: (username?: string) => any,
  register: (username: string, email: string, password: string, fullName?: string) => any,
  accessToken: (email: string, password: string) => any,
  removeAccessToken: () => any,
  updateUser: (data: any) => any,
  requestPasswordReset: (username: string, email: string) => any,
  hasPermissions: (permissions: string) => any,
  putAcl: (objectType: string, typeRelativeObjectId: string, body: any) => any
}

const securityEndpoints = (serverUrl: string) => {
  const getSecurityUrl = getSecurityGenerator(serverUrl)
  return {
    createUser: getSecurityUrl('/create_user'),
    user: getSecurityUrl('/user'),
    accessToken: getSecurityUrl('/access_token'),
    removeAccessToken: getSecurityUrl('/remove_access_token'),
    forgotPassword: getSecurityUrl('/forgot_password'),
    hasPermissions: getSecurityUrl('/has_permission'),
    ownershipAcl: getSecurityUrl('/ownership/{0}/{1}/acl'),
  }
}

const securityApi: (serverUrl?: string) => SecurityApi = (serverUrl) => {
  const resolvedServerUrl = serverUrl ? serverUrl : getApiServerUrl()
  const endpoints = securityEndpoints(resolvedServerUrl)

  // Builds the access-token request against an explicit host, so login can be
  // retried against fallback servers (see accessToken below). The
  // X-SAPSSE-Forward-Request-To header lets our load balancers forward this
  // POST to any replica instance rather than pinning it to the primary.
  const requestAccessToken = (host: string, email: string, password: string) => dataRequest(
    securityEndpoints(host).accessToken(),
    { method: HttpMethods.POST,
      dataProcessor: mapResToAccessTokenData,
      signer: null,
      body: { password, username: email },
      bodyType: 'x-www-form-urlencoded',
      headers: { 'X-SAPSSE-Forward-Request-To': 'replica' },
    },
  ) as Promise<ApiAccessToken>

  return {
    user: (username?: string) => dataRequest(
      endpoints.user({ urlParams: username && { username } }),
      { dataProcessor: mapResToUser },
    ) as Promise<User>,

    register: (username: string, email: string, password: string, fullName?: string) => dataRequest(
      endpoints.createUser({ urlParams: { email, password, username, ...(fullName ? { fullName } : {}) } }),
      { method: HttpMethods.POST, dataProcessor: mapResToAccessTokenData, signer: null },
    ) as Promise<ApiAccessToken>,

    // Logs in against the configured server, then falls back to the shared
    // SAP Sailing hosts if that server is unreachable/broken. A rejected
    // credential (401 -> AuthException) is final and is NOT retried elsewhere.
    accessToken: async (email: string, password: string) => {
      const hosts = uniq([resolvedServerUrl, ...LOGIN_FALLBACK_SERVER_URLS])
      let lastError: any
      for (const host of hosts) {
        try {
          return await requestAccessToken(host, email, password)
        } catch (err: any) {
          if (err && err.name === AuthException.NAME) {
            throw err
          }
          lastError = err
        }
      }
      throw lastError
    },

    removeAccessToken: () => dataRequest(
      endpoints.removeAccessToken(),
      { method: HttpMethods.POST },
    ),

    updateUser: (data: any) => request(
      endpoints.user({ urlParams: data }),
      { method: HttpMethods.PUT },
    ),

    requestPasswordReset: (username: string, email: string) => dataRequest(
      !isEmpty(username) ? endpoints.forgotPassword({ urlParams: { username } }) :
        endpoints.forgotPassword({ urlParams: { email } }),
      { method: HttpMethods.POST },
    ),

    hasPermissions: (permissions: string) => dataRequest(
      endpoints.hasPermissions({ urlParams: { permission: permissions } })
    ),

    putAcl: (objectType: string, typeRelativeObjectId: string, body: any) => dataRequest(
      endpoints.ownershipAcl({
        pathParams: [objectType, typeRelativeObjectId]
      }),
      { body, method: HttpMethods.PUT }
    ),
  }
}

export default securityApi
