import { TrackingDisplayable } from 'models/base'
import RaceStats from 'models/RaceStats'

export const ApiBodyKeys = {
  Name: 'name',
  Id: 'id',
  Regatta: 'regatta',
  StartDate: 'startOfRace-ms',
  EndDate: 'endOfRace-ms',
  TrackingStartDate: 'startOfTracking-ms',
  TrackingEndDate: 'endOfTracking-ms',
}

export const mapResToRace = (map: any) => map && ({
  id: map[ApiBodyKeys.Id],
  name: map[ApiBodyKeys.Name],
  startDate: map[ApiBodyKeys.StartDate],
  endDate: map[ApiBodyKeys.EndDate],
  trackingStartDate: map[ApiBodyKeys.TrackingStartDate],
  trackingEndDate: map[ApiBodyKeys.TrackingEndDate],
  regattaName: map[ApiBodyKeys.Regatta],
} as Race)


export default interface Race extends TrackingDisplayable {
  id?: string
  name?: string
  regattaName?: string
  startDate?: number
  endDate?: number
  trackingStartDate: number
  trackingEndDate: number
  venueName?: string
  boatClass?: string
  columnName?: string
  statistics?: RaceStats
}
