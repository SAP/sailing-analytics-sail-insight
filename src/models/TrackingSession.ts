import { Handicap } from 'models/TeamTemplate'

export default interface TrackingSession {
  name: string
  trackName: string
  boatName: string
  boatClass: string
  sailNumber: string
  nationality: string,
  teamName: string
  teamImage?: string,
  handicap?: Handicap,
  privacySetting: string
  boatId?: string
}
