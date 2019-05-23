import { getApiServerUrl, getSecurityGenerator, HttpMethods } from 'api/config'
import { dataRequest, request } from 'api/handler'
import { isEmpty } from 'lodash'
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
  updateUser: (data: any) => any,
  requestPasswordReset: (username: string, email: string) => any,
}

const securityEndpoints = (serverUrl: string) => {
  const getSecurityUrl = getSecurityGenerator(serverUrl)
  return {
    createUser: getSecurityUrl('/create_user'),
    user: getSecurityUrl('/user'),
    accessToken: getSecurityUrl('/access_token'),
    forgotPassword: getSecurityUrl('/forgot_password'),
  }
}

const securityApi: (serverUrl?: string) => SecurityApi = (serverUrl) => {
  const endpoints = securityEndpoints(serverUrl ? serverUrl : getApiServerUrl())
  return {
    user: (username?: string) => dataRequest(
      endpoints.user({ urlParams: username && { username } }),
      { dataProcessor: mapResToUser },
    ) as Promise<User>,

    register: (username: string, email: string, password: string, fullName?: string) => dataRequest(
      endpoints.createUser({ urlParams: { email, password, username, ...(fullName && { fullName }) } }),
      { method: HttpMethods.POST, dataProcessor: mapResToAccessTokenData, signer: null },
    ) as Promise<ApiAccessToken>,

    accessToken: (email: string, password: string) => dataRequest(
      endpoints.accessToken(),
      { method: HttpMethods.POST,
        dataProcessor: mapResToAccessTokenData,
        signer: null,
        body: { password, username: email },
        bodyType: 'x-www-form-urlencoded'
      },
    ) as Promise<ApiAccessToken>,

    updateUser: (data: any) => request(
      endpoints.user({ urlParams: data }),
      { method: HttpMethods.PUT },
    ),

    requestPasswordReset: (username: string, email: string) => dataRequest(
      !isEmpty(username) ? endpoints.forgotPassword({ urlParams: { username } }) :
        endpoints.forgotPassword({ urlParams: { email } }),
      { method: HttpMethods.POST },
    ),
  }
}

export default securityApi