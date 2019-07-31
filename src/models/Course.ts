export type MarkID = string

export enum ControlPointClass {
  Mark = 'Mark',
  MarkPair = 'ControlPointWithTwoMarks'
}

export interface ControlPoint {
  class: ControlPointClass
  id: MarkID
}

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

export interface Mark extends ControlPoint {
  longName: string
  shortName?: string
  type: MarkType
  position?: Geolocation | TrackingDevice
  shape?: MarkShape
  color?: string
  pattern?: MarkPattern
}

export interface MarkPair<T = Mark> extends ControlPoint {
  leftMark: T
  rightMark?: T
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

interface CourseBase {
  name: string
}

export interface Course extends CourseBase {
  waypoints: Waypoint[]
}

export interface CourseState extends CourseBase {
  waypoints: WaypointState[]
}

interface WaypointBase {
  id: string
  shortName?: string
  longName: string
  passingInstruction: PassingInstruction
}

export interface Waypoint extends WaypointBase {
  controlPoint: MarkPair<Mark> | Mark
}

// This is the Course model that is used in the redux state
// with MarkIDs instead of the actual Mark model
export interface WaypointState extends WaypointBase {
  controlPoint: ControlPointState
}

export type MarkPairState = MarkPair<MarkID>
export type MarkState = ControlPoint
export type ControlPointState = MarkPairState | MarkState

// Since the selected course is the one that will be edited,
// it contains partial information about the waypoints
export interface SelectedCourseState {
  name: string
  waypoints: Partial<WaypointState>[]
}
