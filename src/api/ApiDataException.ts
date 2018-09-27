class ApiDataException extends Error {
  public static NAME = 'ApiDataException'

  constructor(message: string) {
    super(message)
    this.name = ApiDataException.NAME
    this.message = message
  }
}

export default ApiDataException
