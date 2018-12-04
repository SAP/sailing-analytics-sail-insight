
export const mapResToRaceStats = (map: any) => map && ({
  raceId: map.id,
  raceColumnName: map.columnName,
  avgSpeedDownwindKts: map['averageSpeedOverGround-kts'],
  avgSpeedUpwindKts: map['averageSpeedOverGround-kts'],
  maxSpeedDownwindKts: map.maxSpeedOverGroundInKnots, // TODO: add max speed key
  maxSpeedUpwindKts: map.maxSpeedOverGroundInKnots, // TODO: add max speed key
  windDirection: map[''], // TODO: wind direction
  windSpeed: map[''], // TODO: wind speed
  numberOfManeuvers: map.numberOfManeuvers,
  timeTraveledInS: map['timeTraveled-s'],
  distanceInM: map['distanceTraveled-m'],
} as RaceStats)

export default interface RaceStats {
  raceId?: string
  columnName?: string
  distanceInM?: number
  timeTraveledInS?: number
  windDirection?: number
  windSpeed?: number
  avgSpeedUpwindKts?: number
  avgSpeedDownwindKts?: number
  maxSpeedUpwindKts?: number
  maxSpeedDownwindKts?: number
  numberOfManeuvers?: number
}
