export type Mark = any

// Got this from https://www.sapsailing.com/sailingserver/webservices/api/v1/addCourseDefinitionToRaceLog.html
export type PassingInstruction =
  | 'Port'
  | 'Starboard'
  | 'Line'
  | 'None'
  | 'Gate'
  | 'Offset'
  | 'FixedBearing'
  | 'Single_Unknown'

export interface Course {
  name: string,
  waypoints: Waypoint[]
}

export interface Waypoint {
  passingInstruction: PassingInstruction
  leftMark: Mark
  rightMark?: Mark
}

export interface CourseState {
  name: string,
  waypoints: WaypointState[]
}

export interface WaypointState {
  passingInstruction: PassingInstruction
  leftMarkId: string
  rightMarkId?: string
}
