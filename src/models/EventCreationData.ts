export default interface EventCreationData {
  name: string
  dateFrom?: string
  dateTo?: string
  location: string
  regattaType: string
  boatClass: string
  ratingSystem?: string
  numberOfRaces: number
  discardsStart: number
}
