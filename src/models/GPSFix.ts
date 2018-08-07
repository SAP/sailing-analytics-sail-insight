export default class GPSFix {
  public speedInKnots: number | null
  public bearingInDeg: number | null

  constructor(latitude: number, longitude: number, timeMillis: number)
  constructor(
    public latitude: number,
    public longitude: number,
    public timeMillis: number,
    speedInKnots?: number,
    bearingInDeg?: number,
  ) {
    this.latitude = latitude
    this.longitude = longitude
    this.timeMillis = timeMillis
    this.speedInKnots = speedInKnots || null
    this.bearingInDeg = bearingInDeg || null
  }
}
