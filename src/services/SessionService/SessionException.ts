export default class SessionException extends Error {
  public static NAME: string = 'SessionException'

  constructor(message: string) {
    super(message)
    this.message = message
    this.name = SessionException.NAME
  }
}
