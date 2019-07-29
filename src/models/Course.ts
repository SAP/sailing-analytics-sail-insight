export type MarkID = string
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

// With T = Mark this is the Course model that is used in the UI
export interface Course<T = Mark> {
  name: string,
  waypoints: Waypoint<T>[]
}

export interface Waypoint<T = Mark> {
  id: string
  shortName?: string
  longName: string
  passingInstruction: PassingInstruction
  leftMark: T
  rightMark?: T
}

// This is the Course model that is used in the redux state
// with MarkIDs instead of the actual Mark model
export type CourseState = Course<MarkID>
export type WaypointState = Waypoint<MarkID>

export interface CourseCreationState {
  name: string
  waypoints: Array<Partial<Waypoint<MarkID>>>
}
