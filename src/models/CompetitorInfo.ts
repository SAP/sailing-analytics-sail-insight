import { Handicap } from 'models/TeamTemplate'

export default interface CompetitorInfo {
  boatName?: string
  boatClass?: string
  sailNumber?: string
  boatId?: string
  nationality?: string
  teamName?: string
  teamImage?: string
  handicap?: Handicap
  name?: string
}
