export default class LocationTrackingException extends Error {
  public static NAME: string = 'LocationTrackingException'

  public data: any

  constructor(message: string, data?: any) {
    super(message)
    this.name = LocationTrackingException.NAME
    this.data = data
  }
}
