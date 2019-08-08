export enum GateSide {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type MarkID = string

export enum ControlPointClass {
  Mark = 'Mark',
  MarkPair = 'ControlPointWithTwoMarks',
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

export enum MarkPositionType {
  Geolocation =  'GEOLOCATION',
  PingedLocation =  'PINGED_LOCATION',
  TrackingDevice = 'TRACKING_DEVICE',
}

export interface Location {
  latitude: number
  longitude: number
}

export interface Geolocation extends Location {
  positionType: MarkPositionType.Geolocation
}

export interface PingedLocation extends Location {
  positionType: MarkPositionType.PingedLocation
}

export interface TrackingDevice {
  positionType: MarkPositionType.TrackingDevice
  deviceUuid: string
}

export interface Mark {
  id: MarkID
  class: ControlPointClass.Mark
  longName: string
  shortName?: string
  type: MarkType
  position?: Geolocation | TrackingDevice | PingedLocation
  shape?: MarkShape
  color?: string
  pattern?: MarkPattern
}

export interface MarkPair<T = Mark> {
  id: MarkID
  class: ControlPointClass.MarkPair
  longName?: string
  shortName?: string
  leftMark?: T
  rightMark?: T
}

// Got this from https://www.sapsailing.com/sailingserver/webservices/api/v1/addCourseDefinitionToRaceLog.html
export enum PassingInstruction {
  Port = 'Port',
  Starboard = 'Starboard',
  Line =  'Line',
  None = 'None',
  Gate = 'Gate',
  Offset = 'Offset',
  FixedBearing = 'FixedBearing',
  SingleUnknown = 'Single_Unknown',
}

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
  controlPoint: ControlPoint
}

// This is the Course model that is used in the redux state
// with MarkIDs instead of the actual Mark model
export interface WaypointState extends WaypointBase {
  controlPoint: ControlPointState
}

export type MarkPairState = MarkPair<MarkID>
export type MarkState = Pick<Mark, 'id' | 'class'>
export type ControlPoint = MarkPair<Mark> | Mark
export type ControlPointState = MarkPairState | MarkState

// Since the selected course is the one that will be edited,
// it contains partial information about the waypoints
export interface SelectedCourseState {
  name: string
  waypoints: Partial<WaypointState>[]
}

export interface SelectedEventInfo {
  serverUrl: string
  regattaName: string
  leaderboardName: string
  secret?: string
}

export interface SelectedRaceInfo extends SelectedEventInfo {
  raceColumnName: string
  fleet: string
}

export interface CourseStateMap { [id: string]: CourseState }
export interface MarkMap { [id: string]: Mark }
export interface MarkPairMap { [id: string]: MarkPairState }
