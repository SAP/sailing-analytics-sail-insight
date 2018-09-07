export default class Session {
  constructor(
    public name: string,
    public trackName: string,
    public boatName: string,
    public sailNumber: string,
    public teamName: string,
    public privacySetting: string,
  ) {
    this.name = name
    this.trackName = trackName
    this.boatName = boatName
    this.sailNumber = sailNumber
    this.teamName = teamName
    this.privacySetting = privacySetting
  }

  public toPlainObject() {
    return {
      name: this.name,
      trackName: this.trackName,
      boatName: this.boatName,
      sailNumber: this.sailNumber,
      teamName: this.teamName,
      privacySetting: this.privacySetting,
    }
  }
}
