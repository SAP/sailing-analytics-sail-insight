export enum RegattaType {
  OneDesign = 'ONE_DESIGN',
  Handicap = 'HANDICAP',
}

export default interface EventCreationData {
  name: string
  dateFrom: string
  dateTo: string
  location: string
  regattaType: RegattaType
  boatClass: string
  numberOfRaces: number
  discards?: number[]
}
