export enum RegattaType {
  OneDesign = 'ONE_DESIGN',
  Handicap = 'HANDICAP',
}

export enum HandicapRatingSystem {
  TimeOnTimeAndDistance = 'TIME_ON_TIME_AND_DISTANCE',
  ORCPerformanceCurve = 'ORC_PERFORMANCE_CURVE',
}

export default interface EventCreationData {
  name: string
  dateFrom: string
  dateTo: string
  location: string
  regattaType: RegattaType
  boatClass: string
  ratingSystem: HandicapRatingSystem
  numberOfRaces: number
  discardsStart: number
}
