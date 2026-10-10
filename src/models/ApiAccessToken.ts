export const ApiBodyKeys = {
  AccessToken: 'access_token',
  Username: 'username',
}

export const mapResToAccessTokenData = (data: any) => {
  const accessToken = data && data[ApiBodyKeys.AccessToken]
  if (typeof accessToken !== 'string' || accessToken.trim().length === 0) {
    throw new Error('Invalid access token response: missing access_token')
  }
  return {
    accessToken,
    username: data[ApiBodyKeys.Username],
  } as ApiAccessToken
}


export default interface ApiAccessToken {
  accessToken?: string
  username?: string
}
