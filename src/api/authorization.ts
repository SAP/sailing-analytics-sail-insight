import { BodyType } from 'api/config'


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
export type Signer = (data: SignerOptions) => any


export const tokenSigner = (token: string) => (options: SignerOptions = {}) => ({
  ...options.headers,
  Authorization: `Bearer ${token}`,
})
