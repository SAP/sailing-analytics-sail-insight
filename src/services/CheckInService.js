import querystring from 'query-string'
import parse from 'url-parse'

const UrlPropertyNames = {
  BoatId: 'boat_id',
  EventId: 'event_id',
  LeaderboardName: 'leaderboard_name',
  CompetitorId: 'competitor_id',
  MarkId: 'mark_id',
}

const extractData = (url) => {
  if (!url) {
    return null
  }

  const serverUrl = parse(url)?.origin
  if (!serverUrl) {
    return null
  }

  const queryData = querystring.parseUrl(url)?.query
  if (!queryData) {
    return null
  }

  const eventId = queryData[UrlPropertyNames.EventId]
  const leaderboardName = queryData[UrlPropertyNames.LeaderboardName]
  if (!eventId || !leaderboardName) {
    return null
  }

  const boatId = queryData[UrlPropertyNames.BoatId]
  const markId = queryData[UrlPropertyNames.MarkId]
  const competitorId = queryData[UrlPropertyNames.CompetitorId]

  if (!boatId && !markId && !competitorId) {
    return null
  }

  return {
    serverUrl,
    eventId,
    leaderboardName,
    isTraining: false,
    ...(boatId && { boatId }),
    ...(competitorId && { competitorId }),
    ...(boatId && { markId }),
  }
}

export default {
  extractData,
}
