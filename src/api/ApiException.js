class ApiException extends Error {
  static NAME = 'ApiException'

  constructor(message, status, data) {
    super(message)
    this.message = message
    this.name = ApiException.NAME
    this.data = data
    this.status = status
  }
}

export default ApiException
