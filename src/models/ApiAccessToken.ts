export const ApiBodyKeys = {
  AccessToken: 'access_token',
  Username: 'username',
}

export const mapResToAccessTokenData = (data: any) => data && ({
  accessToken: data[ApiBodyKeys.AccessToken],
  username: data[ApiBodyKeys.Username],
} as ApiAccessToken)


export default interface ApiAccessToken {
  accessToken?: string
  username?: string
}
