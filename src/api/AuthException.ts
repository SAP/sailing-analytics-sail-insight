import ApiException from './ApiException'

class AuthException extends ApiException {
  public static NAME = 'AuthException'

  public static create(message: string) {
    const newInstance = new AuthException(message)
    newInstance.status = 401
    return newInstance
  }

  protected constructor(message: string) {
    super(message)
    this.name = AuthException.NAME
  }
}

export default AuthException
