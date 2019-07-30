export interface CreateEventBody {
  eventName?: string
  boatclassname: string
  venuename: string
  numberofraces?: number
  competitorRegistrationType?: 'CLOSED' | 'OPEN_UNMODERATED' | 'OPEN_MODERATED'
  secret?: string
  createleaderboardgroup?: boolean
  createregatta?: boolean
  startdate?: string
  enddate?: string
}

export interface UpdateEventBody {
  enddateasmillis: number
}

export interface AddRaceColumnsBody {
  prefix?: string
  numberofraces?: number
}

export interface StopTrackingBody {
  race_column?: string
  fleet?: string
}

interface BaseSetupTrackingBody {
  race_column: string
  fleet: string
}
export interface StartTrackingBody extends BaseSetupTrackingBody {
  trackWind?: boolean
  correctWindDirectionByMagneticDeclination?: boolean
}

export interface SetTrackingTimesBody extends BaseSetupTrackingBody {
  startoftracking?: Date,
  startoftrackingasmillis?: number,
  endoftracking?: Date,
  endoftrackingasmillis?: number,
}


interface BaseCompetitorBody {
  nationalityIOC?: string,
  timeontimefactor?: number,
  timeondistanceallowancepernauticalmileasmillis?: number,
  searchtag?: string,
  competitorName?: string,
  competitorEmail?: string,
}
export interface CompetitorBody extends BaseCompetitorBody {
  boatclass: string,
  sailid?: string,
}

export interface CompetitorWithBoatBody extends BaseCompetitorBody {
  boatId: string,
}

export interface CompetitorBody {
  boatclass: string,
  sailid?: string,
  nationalityIOC?: string,
  timeontimefactor?: number,
  timeondistanceallowancepernauticalmileasmillis?: number,
  searchtag?: string,
  competitorName?: string,
  competitorEmail?: string,
  secret?: string
  deviceUuid?: string
}

export interface CreateEventResponseData {
  eventid: string
  eventname: string
  eventstartdate: number
  eventenddate: number
  leaderboardgroupid: string
  regatta: string
  leaderboard: string
}

export interface AddRaceColumnResponseData {
  seriesname: string
  racename: string
}

export interface CompetitorResponseData {
  idtype: string
  id: string
  name: string
  shortName?: string
  displayColor?: string
  email: string
  searchTag?: string
  nationality?: string
  nationalityISO2?: string
  nationalityISO3?: string
  team: {
    name: string
    coach: string
    sailors: [{
      name: string
      description?: string
      nationality: {
        IOC?: string,
      },
    }],
  }
  boat: {
    idtype: string
    id: string
    name: string
    sailId: string
    color?: string
    boatClass: {
      name: string
      typicallyStartsUpwind: boolean,
    },
  }
  timeOnTimeFactor?: string
  timeOnDistanceAllowanceInSecondsPerNauticalMile?: string
}


export interface WindBodyData {
  position: {
    latitude_deg: number,
    longitude_deg: number,
  },
  timepoint: number,
  direction: number,
  speedinknots: number,
}

interface WindRegattaData {
  regattaName: string
  raceName: string
}

export interface WindBody {
  windData: WindBodyData[]
  regattaNamesAndRaceNames: WindRegattaData[]
  windSourceType: string
  windSourceId: string
}

type RaceLogClass = 'RaceLogStartTimeEvent' | 'RaceLogRaceStatusEvent'
type RaceLogRaceStatus =
  'UNKNOWN' |
  'UNSCHEDULED' |
  'PRESCHEDULED' |
  'SCHEDULED' |
  'STARTPHASE' |
  'RUNNING' |
  'FINISHING' |
  'FINISHED'
export interface RaceLogOptions {
  '@class': RaceLogClass
  id: number | string
  createdAt: number
  passId: number
  competitors: any[]
  nextStatus: RaceLogRaceStatus
  startTime?: number
  author?: string
  authorPriority?: number
  finishTime?: number
  timestamp: number
}

export interface ManeuverChangeItem {
  raceName: string
  regattaName: string
}


export interface Maneuver {
  maneuverType: 'HEAD_UP' | 'BEAR_AWAY' | 'TACK' | 'JIBE' | 'PENALTY_CIRCLE' | 'UNKNOWN'
  newTack: any
  speedBeforeInKnots: number
  cogBeforeInTrueDegrees: number
  speedAfterInKnots: number
  cogAfterInTrueDegrees: number
  directionChangeInDegrees: number
  maneuverLoss: {
    geographicalMiles: number
    seaMiles: number
    nauticalMiles: number
    meters: number
    kilometers: number
    centralAngleDeg: number
    centralAngleRad: number,
  }
  positionAndTime: {
    type: string
    lat_deg: number
    lon_deg: number
    unixtime: number,
  }
  maxTurningRateInDegreesPerSecond: number
  avgTurningRateInDegreesPerSecond: number
  lowestSpeedInKnots: number
  markPassing: boolean
}
export interface CompetitorManeuverItem {
  competitor: string
  maneuvers: Maneuver[]
}

export interface BoatClassesdBody {
  name: string
  typicallyStartsUpwind: boolean,
  hullLengthInMeters: number,
  hullBeamInMeters: number,
  displayName?: string,
  iconUrl?: string,
  aliasNames: string[],
}

export interface CountryCodeBody {
  twoLetterIsoCode?: string
  threeLetterIocCode: string,
  name: string,
  unIsoNumeric?: string,
  unVehicle?: string,
  ianaInternet?: string,
  threeLetterIsoCode: string,
}

export interface AddMarkFixBody {
  leaderboardName: string
  raceColumnName: string
  fleetName: string
  markId: string
  lonDeg: number
  latDeg: number
  timeMillis: number
}

export interface AddCourseDefinitionToRaceLogBody {
  leaderboardName: string
  raceColumnName: string
  fleetName: string
  controlPoints: any[]
}
