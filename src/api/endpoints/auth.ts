import { tokenSigner } from 'api/authorization'
import { getSecurityUrl, HttpMethods } from 'api/config'
import { dataRequest, request } from 'api/handler'
import {
  ApiAccessToken,
  User,
} from 'models'
import { mapResToAccessTokenData } from 'models/ApiAccessToken'
import { mapResToUser } from 'models/User'


const endpoints = ({
  createUser: getSecurityUrl('/create_user'),
  user: getSecurityUrl('/user'),
  accessToken: getSecurityUrl('/access_token'),
})


export default {
  user: (token: string, username?: string) => dataRequest(
    endpoints.user({ urlParams: username && { username } }),
    { dataProcessor: mapResToUser, signer: tokenSigner(token) },
  ) as Promise<User>,

  register: (email: string, password: string, fullName?: string) => dataRequest(
    endpoints.createUser({ urlParams: { email, password, username: email, ...(fullName && { fullName }) } }),
    { method: HttpMethods.POST, dataProcessor: mapResToAccessTokenData },
  ) as Promise<ApiAccessToken>,

  accessToken: (email: string, password: string) => dataRequest(
    endpoints.accessToken({ urlParams: { password, username: email } }),
    { method: HttpMethods.POST, dataProcessor: mapResToAccessTokenData },
  ) as Promise<ApiAccessToken>,

  updateUser: (token: string, data: any) => request(
    endpoints.user({ urlParams: data }),
    { method: HttpMethods.PUT, signer: tokenSigner(token) },
  ),
}
