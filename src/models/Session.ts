import { Boat, CheckIn, Competitor, Event, Leaderboard, Mark, Regatta } from 'models'
import { TrackingDisplayable } from 'models/base'

export default interface Session extends CheckIn, TrackingDisplayable {
  regatta?: Regatta,
  event?: Event,
  competitor?: Competitor
  leaderboard?: Leaderboard
  mark?: Mark
  boat?: Boat
}
