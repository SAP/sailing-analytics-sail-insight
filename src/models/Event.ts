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
  VenueName: 'name',
}


export const mapResToEvent = (map: any) => map && ({
  id : map[ApiBodyKeys.Id],
  name : map[ApiBodyKeys.Name],
  description : map[ApiBodyKeys.Description],
  officialWebsiteURL : map[ApiBodyKeys.OfficialWebsiteURL],
  baseURL : map[ApiBodyKeys.BaseURL],
  startDate : map[ApiBodyKeys.StartDate],
  endDate : map[ApiBodyKeys.EndDate],
  venue : map[ApiBodyKeys.Venue],
  leaderboardGroups : map[ApiBodyKeys.LeaderboardGroups],
  imageSizes : map[ApiBodyKeys.ImageSizes],
  images : map[ApiBodyKeys.Images],
  videos : map[ApiBodyKeys.Videos],
  sailorsInfoWebsiteURLs : map[ApiBodyKeys.SailorsInfoWebsiteURLs],
} as Event)


export default interface Event {
  id?: string
  name?: string
  description?: string
  officialWebsiteURL?: string
  baseURL?: string
  startDate?: number
  endDate?: number
  venue?: {name?: string}
  leaderboardGroups?: any[]
  imageSizes?: any[]
  images?: any[]
  videos?: any[]
  sailorsInfoWebsiteURLs?: string
  archived?: boolean
}
