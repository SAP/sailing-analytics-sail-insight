export default class CheckIn {
  constructor(
    public serverUrl: string,
    public eventId: string,
    public leaderboardName: string | any,
    public isTraining: boolean = false,
    public competitorId?: string,
    public boatId?: string,
    public markId?: string,
  ) {
    this.serverUrl = serverUrl
    this.eventId = eventId
    this.leaderboardName = leaderboardName
    this.isTraining = isTraining
    this.competitorId = competitorId
    this.boatId = boatId
    this.markId = markId
  }

  public isValid() {
    return this.serverUrl &&
      this.eventId &&
      this.leaderboardName &&
      (this.competitorId || this.boatId || this.markId)
  }

  public toPlainObject() {
    return {
      serverUrl: this.serverUrl,
      eventId: this.eventId,
      leaderboardName: this.leaderboardName,
      isTraining: this.isTraining,
      competitorId: this.competitorId,
      markId: this.markId,
      boatId: this.boatId,
    }
  }
}
