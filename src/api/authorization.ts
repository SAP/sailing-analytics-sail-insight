import { BodyType } from 'api/config'
import { getAccessToken } from 'selectors/auth'
import { getStore } from 'store'


export interface SignerOptions {
  url?: string,
  method?: string,
  headers?: any,
  body?: any
}
export interface RequestOptions {
  method?: string
  signer?: Signer
  body?: any,
  bodyType?: BodyType
}
export type Signer = ((data: SignerOptions) => any) | null


export const tokenSigner = (options: SignerOptions = {}) => {
  const token = getAccessToken(getStore().getState())
  return {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}
