import ApiException from './ApiException'


class ApiDataException extends ApiException {
  public static NAME = 'ApiDataException'

  public static create(message: string) {
    return new ApiDataException(message)
  }

  protected constructor(message: string) {
    super(message)
    this.name = ApiDataException.NAME
  }
}

export default ApiDataException
