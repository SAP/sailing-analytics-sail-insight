import { prop, propEq, propOr, find, compose, path, defaultTo, append,
  equals, identity, head, when, isNil, always, last, either, isEmpty,
  apply, map, take, move, evolve, dissoc, not, flatten, reject, __, filter,
  curry, reduce, assoc, keys, both, inc, range, concat, join, ifElse, pathOr,
  fromPairs, mergeWithKey, values, pick, uniqBy, includes, merge, pathEq
} from 'ramda'
import { createSelector } from 'reselect'
import { getSelectedEventInfo } from 'selectors/event'
import { toHashedString } from 'helpers/utils'
import { PassingInstruction } from 'models/Course'

import {
  CourseState,
  CourseStateMap,
} from 'models/Course'

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

export const getCourseLoading = (state: any): boolean => state.courses.courseLoading
export const getCourses = (state: any): CourseStateMap => state.courses.all

export const getCourseById = (courseId: string) => createSelector(
  getCourses,
  courses => courses[courseId] as CourseState | undefined)

export const getSelectedCourse = createSelector(
  getSelectedEventInfo,
  (state: any) => state.courses.selectedCourse,
  getCourses,
  (selectedEventInfo, selectedCourseInfo, courses) => courses[`${selectedEventInfo.regattaName} - ${selectedCourseInfo.race}`])

export const getAllCoursesForSelectedEvent = createSelector(
  getSelectedEventInfo,
  getCourses,
  (selectedEventInfo, courses) => compose(
    map(key => prop(key, courses)),
    map(compose(concat(`${selectedEventInfo.regattaName} - ${selectedEventInfo.trackPrefix || 'R'}`), String)),
    range(1),
    inc)(
    selectedEventInfo.numberOfRaces))

export const getEditedCourse = (state: any) => state.courses.editedCourse

export const getSelectedWaypoint = createSelector(
  getEditedCourse,
  (state: any): string | undefined => state.courses.selectedWaypoint,
  (editedCourse, waypointId) => find(propEq('id', waypointId), editedCourse.waypoints))

export const isDefaultWaypointSelection = (state: any) => state.courses.isDefaultWaypointSelection
export const isSelectedWaypointLineOrGate = createSelector(
  getSelectedWaypoint,
  compose(
    includes(__, [PassingInstruction.Line, PassingInstruction.Gate]),
    prop('passingInstruction'))
)

export const getMarkConfigurationById = id => createSelector(
  getEditedCourse,
  compose(find(propEq('id', id)), prop('markConfigurations')))

export const getSelectedMarkConfiguration = createSelector(
  getSelectedWaypoint,
  state => state.courses.selectedMarkConfiguration,
  (selectedWaypoint, selectedMarkConfiguration) =>
  selectedWaypoint && compose(
    when(isNil, always(head(selectedWaypoint.markConfigurationIds || []))),
    find(equals(selectedMarkConfiguration)),
    defaultTo([]),
    prop('markConfigurationIds'))(
    selectedWaypoint))

export const getMarkPropertiesByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    defaultTo({}),
    prop('effectiveProperties'),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

export const getMarkPositionByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    renameKeys({
      'lat_deg': 'latitude_deg',
      'lon_deg': 'longitude_deg'
    }),
    prop('lastKnownPosition'),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

const concatTrackingDevices = (key, l, r) => key == 'trackingDevices' ? concat(l, r) : r

export const getMarkDeviceTrackingByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    find(both(
      propEq('trackingDeviceType', 'smartphoneUUID'),
      compose(isNil, prop('trackingDeviceMappedToMillis')))),
    defaultTo([]),
    prop('trackingDevices'),
    // In case of a mark properties object, tracker is found on the currentTrackingDeviceId
    // property instead of having a trackingDevices array. This fuses currentTrackingDeviceId
    // into trackingDevices so the information is correctly displayed in the visual components
    when(prop('currentTrackingDeviceId'), v => mergeWithKey(concatTrackingDevices, {
      trackingDevices: [{
        trackingDeviceType: 'smartphoneUUID',
        trackingDeviceHash: toHashedString(v.currentTrackingDeviceId.id)
      }]
    }, v)),
    find(propEq('id', markConfigurationId)),
    prop('markConfigurations')))

export const getSelectedMarkProperties = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkPropertiesByMarkConfiguration(markConfigurationId)(state))

export const getSelectedMarkDeviceTracking = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkDeviceTrackingByMarkConfiguration(markConfigurationId)(state))

export const getSelectedMarkPosition = createSelector(
  getSelectedMarkConfiguration,
  identity,
  (markConfigurationId, state) => getMarkPositionByMarkConfiguration(markConfigurationId)(state))

export const hasSameStartFinish = createSelector(
  getEditedCourse,
  compose(
    apply(equals),
    map(prop('markConfigurationIds')),
    take(2),
    move(-1, 0),
    prop('waypoints')))

export const hasEditedCourseChanged = createSelector(
  getSelectedCourse,
  getEditedCourse,
  (selectedCourse, editedCourse) => compose(
    not,
    equals(compose(
      dissoc('shortName'),
      evolve({ waypoints: map(dissoc('id')) }))(selectedCourse)),
    evolve({ waypoints: map(dissoc('id')) }))(
    editedCourse))

export const waypointLabel = (waypoint: any) => compose(
  course => {
    const isStartOrFinish = head(course.waypoints).id === waypoint.id || last(course.waypoints).id === waypoint.id

    return isStartOrFinish ? waypoint.controlPointName : waypoint.controlPointShortName || compose(
      defaultTo('\u2022'),
      path(['effectiveProperties', 'shortName']),
      find(propEq('id', compose(head, defaultTo([]), prop('markConfigurationIds'))(waypoint))),
      prop('markConfigurations'))(
      course)
  },
  getEditedCourse)

export const getMarkPositionsExceptCurrent = createSelector(
  getEditedCourse,
  getSelectedMarkConfiguration,
  (course, selectedMarkConfiguration) => compose(
    reject(either(isNil, isEmpty)),
    map(renameKeys({
      'lat_deg': 'latitude_deg',
      'lon_deg': 'longitude_deg'
    })),
    map(prop('lastKnownPosition')),
    map(compose(find(__, course.markConfigurations), propEq('id'))),
    reject(equals(selectedMarkConfiguration)),
    flatten,
    map(prop('markConfigurationIds')),
    prop('waypoints'))(
    course))

export const getCourseSequenceDisplay = (courseId: string) => (state: any) => {
  const courseById = getCourseById(courseId)(state)

  return compose(
    join('-'),
    map(
      ifElse(
        prop('controlPointShortName'),
        prop('controlPointShortName'),
        compose(
          pathOr('\u2022', ['effectiveProperties', 'shortName']),
          find(__, propOr([], 'markConfigurations', courseById)),
          propEq('id'),
          pathOr(-1, ['markConfigurationIds', 0])
        )
      )
    ),
    Object.values,
    propOr({}, 'waypoints'),
  )(courseById)
}

export const getMarkConfigurationsMapToEditedCourse = createSelector(
  getAllCoursesForSelectedEvent,
  getEditedCourse,
  (eventCourses, editedCourse) => compose(
    fromPairs,
    map(conf => ([
      conf.id,
      find(
        both(
          pathEq(['effectiveProperties', 'name'], conf.effectiveProperties.name),
          pathEq(['effectiveProperties', 'shortName'], conf.effectiveProperties.shortName)),
        editedCourse.markConfigurations).id
    ])),
    reject(isNil),
    concat(editedCourse.markConfigurations),
    flatten,
    map(prop('markConfigurations')))(
    eventCourses))

export const getLinesAndGateOptionsForCurrentEventAndWaypoint = createSelector(
  isSelectedWaypointLineOrGate,
  getAllCoursesForSelectedEvent,
  getMarkConfigurationsMapToEditedCourse,
  getEditedCourse,
  (isSelectedWaypointLineOrGate, eventCourses, markConfigurationsMap, editedCourse) => compose(
    when(always(isSelectedWaypointLineOrGate), always([])),
    map(compose(
      merge({ isWaypoint: true }),
      evolve({ markConfigurationIds: map(prop(__, markConfigurationsMap)) }))),
    uniqBy(compose(
      reduce(concat, ''),
      values,
      pick(['controlPointName', 'controlPointShortName'])
    )),
    reject(compose(includes(__, ['Start', 'Finish']), prop('controlPointName'))),
    filter(compose(either(equals(PassingInstruction.Line), equals(PassingInstruction.Gate)), prop('passingInstruction'))),
    flatten,
    map(prop('waypoints')),
    append(editedCourse))(
    eventCourses))
