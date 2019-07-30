export type MarkID = string
export enum MarkType {
  Buoy = 'BUOY',
  Cameraboat = 'CAMERABOAT',
  Finishboat = 'FINISHBOAT',
  Landmark = 'LANDMARK',
  Startboat = 'STARTBOAT',
  Umpireboat = 'UMPIREBOAT',
}
export enum MarkShape {
  Conical = 'CONICAL',
  Cylinder = 'CYLINDER',
}
export enum MarkPattern {
  Checkered = 'CHECKERED',
}

export interface Geolocation {
  latitude: number
  longitude: number
}
export type TrackingDevice = any

export interface Mark {
  id: MarkID
  longName: string
  shortName?: string
  type: MarkType
  position?: Geolocation || TrackingDevice
  shape?: MarkShape
  color? string
  pattern?: MarkPattern
}

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

// Since the selected course is the one that will be edited,
// it contains partial information about the waypoints
export interface SelectedCourseState {
  name: string
  waypoints: Partial<WaypointState>[]
}
