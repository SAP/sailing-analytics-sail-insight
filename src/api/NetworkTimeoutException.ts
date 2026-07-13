class NetworkTimeoutException extends Error {
  public static NAME = 'NetworkTimeoutException'

  public static create(message: string) {
    return new NetworkTimeoutException(message)
  }

  public baseTypeName: string = NetworkTimeoutException.NAME

  protected constructor(message: string) {
    super(message)
    this.name = NetworkTimeoutException.NAME
  }
}

export default NetworkTimeoutException
