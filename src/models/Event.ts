export const ApiBodyKeys = {
  Id: 'id',
  Name: 'name',
  Description: 'description',
  OfficialWebsiteURL: 'officialWebsiteURL',
  BaseURL: 'baseURL',
  StartDate: 'startDate',
  EndDate: 'endDate',
  Venue: 'venue',
  LeaderboardGroups: 'leaderboardGroups',
  ImageSizes: 'imageSizes',
  Images: 'images',
  Videos: 'videos',
  SailorsInfoWebsiteURLs: 'sailorsInfoWebsiteURLs',
}

export default class Event {
  public static createInstance(map: any) {
    if (!map) {
      return undefined
    }
    const newInstance = new Event()
    newInstance.id = map[ApiBodyKeys.Id]
    newInstance.name = map[ApiBodyKeys.Name]
    newInstance.description = map[ApiBodyKeys.Description]
    newInstance.officialWebsiteURL = map[ApiBodyKeys.OfficialWebsiteURL]
    newInstance.baseURL = map[ApiBodyKeys.BaseURL]
    newInstance.startDate = map[ApiBodyKeys.StartDate]
    newInstance.endDate = map[ApiBodyKeys.EndDate]
    newInstance.venue = map[ApiBodyKeys.Venue]
    newInstance.leaderboardGroups = map[ApiBodyKeys.LeaderboardGroups]
    newInstance.imageSizes = map[ApiBodyKeys.ImageSizes]
    newInstance.images = map[ApiBodyKeys.Images]
    newInstance.videos = map[ApiBodyKeys.Videos]
    newInstance.sailorsInfoWebsiteURLs = map[ApiBodyKeys.SailorsInfoWebsiteURLs]
    return newInstance
  }

  public id?: string
  public name?: string
  public description?: string
  public officialWebsiteURL?: string
  public baseURL?: string
  public startDate?: number
  public endDate?: number
  public venue?: {name?: string}
  public leaderboardGroups?: any[]
  public imageSizes?: any[]
  public images?: any[]
  public videos?: any[]
  public sailorsInfoWebsiteURLs?: string
}
