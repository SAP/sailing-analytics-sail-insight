class ApiException extends Error {
  public static NAME = 'ApiException'

  public static create(message: string, status: number, data?: any) {
    const newInstance = new ApiException(message)
    newInstance.status = status
    newInstance.data = data
    return
  }
  public baseTypeName: string = ApiException.NAME
  public data?: any
  public status?: number

  protected constructor(message: string) {
    super(message)
    this.name = ApiException.NAME
  }
}

export default ApiException
