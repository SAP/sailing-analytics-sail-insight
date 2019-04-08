export default class CheckInException extends Error {
  public static NAME: string = 'CheckInException'

  constructor(message: string) {
    super(message)
    this.message = message
    this.name = CheckInException.NAME
  }
}
