import { CheckIn, Competitor, Event, Leaderboard, Regatta } from 'models'
import { TrackingDisplayable } from 'models/base'

export default interface Session extends CheckIn, TrackingDisplayable {
  regatta?: Regatta,
  event?: Event,
  competitor?: Competitor
  leaderboard?: Leaderboard
}
