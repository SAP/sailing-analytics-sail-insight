export interface CreateEventBody {
  eventName?: string
  boatclassname: string
  venuename: string
  numberofraces?: number
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

export interface CompetitorBody {
  boatclass: string,
  sailid?: string,
  nationalityIOC?: string,
  timeontimefactor?: number,
  timeondistanceallowancepernauticalmileasmillis?: number,
  searchtag?: string,
  competitorName?: string,
  competitorEmail?: string,
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
