export default class Session {
  constructor(
    public trackName: string,
    public boatName: string,
    public sailNumber: string,
    public teamName: string,
    public privacySetting: string,
  ) {
    this.trackName = trackName
    this.boatName = boatName
    this.sailNumber = sailNumber
    this.teamName = teamName
    this.privacySetting = privacySetting
  }

  public toPlainObject() {
    return {
      trackName: this.trackName,
      boatName: this.boatName,
      sailNumber: this.sailNumber,
      teamName: this.teamName,
      privacySetting: this.privacySetting,
    }
  }
}
