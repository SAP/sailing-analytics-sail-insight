import { CheckIn, Competitor, Event, Leaderboard, Regatta } from 'models'

export default interface Session extends CheckIn {
  regatta?: Regatta,
  event?: Event,
  competitor?: Competitor
  leaderboard?: Leaderboard
}
