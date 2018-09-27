class AuthException extends Error {
  public static NAME = 'AuthException'

  constructor(
    message?: string,
    public code?: string,
  ) {
    super(message)
    this.code = code
  }
}

export default AuthException
