import { getSecurityUrl } from 'api/config'
import { dataRequest, request } from 'api/handler'
import { SignerOptions } from 'api/networking'
import {
  ApiAccessToken,
  User,
} from 'models'
import { mapResToAccessTokenData } from 'models/ApiAccessToken'
import { mapResToUser } from 'models/User'


const endpoints = ({
  createUser: (params?: any) => getSecurityUrl('/create_user', params),
  user: (params?: any) => getSecurityUrl('/user', params),
  accessToken: (params?: any) => getSecurityUrl('/access_token', params),
})

const tokenSigner = (token: string) => (options: SignerOptions = {}) => ({
  ...options.headers,
  Authorization: `Bearer ${token}`,
})


export default {
  user: (token: string, username?: string) => dataRequest(
    endpoints.user(username && { username }),
    { dataProcessor: mapResToUser, signer: tokenSigner(token) },
  ) as Promise<User>,

  register: (email: string, password: string, fullName?: string) => dataRequest(
    endpoints.createUser({ email, password, username: email, ...(fullName && { fullName }) }),
    { method: 'POST', dataProcessor: mapResToAccessTokenData },
  ) as Promise<ApiAccessToken>,

  accessToken: (email: string, password: string) => dataRequest(
    endpoints.accessToken({ password, username: email }),
    { method: 'POST', dataProcessor: mapResToAccessTokenData },
  ) as Promise<ApiAccessToken>,

  updateUser: (token: string, data: any) => request(
    endpoints.user(data),
    { method: 'PUT', signer: tokenSigner(token) },
  ),
}
