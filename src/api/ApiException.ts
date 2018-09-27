class ApiException extends Error {
  public static NAME = 'ApiException'
  public data: any
  public status: number

  constructor(message: string, status: number, data: any) {
    super(message)
    this.name = ApiException.NAME
    this.message = message
    this.data = data
    this.status = status
  }
}

export default ApiException
