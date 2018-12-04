import { fetchEntityAction, withDataApi } from 'helpers/actions'


export const fetchLeaderboardV2 = (leaderboard: string) =>
  withDataApi({ leaderboard })(dataApi => fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboard))
