import { prop, propEq, propOr, find, compose, path, defaultTo, append,
  equals, identity, head, when, isNil, always, last, either, isEmpty,
  apply, map, take, move, evolve, dissoc, not, flatten, reject, __, filter,
  curry, reduce, assoc, keys, both, inc, range, concat, join, ifElse, pathOr,
  mergeWithKey, values, pick, uniqBy, includes, mergeRight
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
  (editedCourse, waypointId) => find(propEq(waypointId, 'id'), editedCourse.waypoints))

export const isDefaultWaypointSelection = (state: any) => state.courses.isDefaultWaypointSelection
export const isSelectedWaypointLineOrGate = createSelector(
  getSelectedWaypoint,
  compose(
    includes(__, [PassingInstruction.Line, PassingInstruction.Gate]),
    prop('passingInstruction'))
)

export const getMarkConfigurationById = id => createSelector(
  getEditedCourse,
  compose(find(propEq(id, 'id')), prop('markConfigurations')))

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
    find(propEq(markConfigurationId, 'id')),
    prop('markConfigurations')))

export const getMarkPositionByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    renameKeys({
      'lat_deg': 'latitude_deg',
      'lon_deg': 'longitude_deg'
    }),
    prop('lastKnownPosition'),
    find(propEq(markConfigurationId, 'id')),
    prop('markConfigurations')))

const concatTrackingDevices = (key, l, r) => key == 'trackingDevices' ? concat(l, r) : r

export const getMarkDeviceTrackingByMarkConfiguration = markConfigurationId => createSelector(
  getEditedCourse,
  compose(
    find(both(
      propEq('smartphoneUUID', 'trackingDeviceType'),
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
    find(propEq(markConfigurationId, 'id')),
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
    const firstWaypoint = course.waypoints?.[0]
    const lastWaypoint = course.waypoints?.length > 0 ? course.waypoints[course.waypoints.length - 1] : null
    const isStartOrFinish = (firstWaypoint?.id === waypoint.id) || (lastWaypoint?.id === waypoint.id)

    return isStartOrFinish ? waypoint.controlPointName : waypoint.controlPointShortName || compose(
      defaultTo('\u2022'),
      path(['effectiveProperties', 'shortName']),
      find(propEq(compose(head, defaultTo([]), prop('markConfigurationIds'))(waypoint), 'id')),
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
    defaultTo([]),
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

export const mapMarkConfigurationsToEditedCourse = (eventCourses: any[], editedCourse: any) => {
  const editedMarkConfigurations = editedCourse?.markConfigurations || []
  const eventMarkConfigurations = (eventCourses || []).reduce(
    (configurations, course) => configurations.concat(course?.markConfigurations || []),
    [] as any[])

  return editedMarkConfigurations
    .concat(eventMarkConfigurations)
    .reduce((configurationMap, configuration) => {
      const name = configuration?.effectiveProperties?.name
      const shortName = configuration?.effectiveProperties?.shortName

      // Old/partial course data may not have effective properties, and a
      // configuration used in another race does not have to exist in the
      // course currently being edited. Neither case should crash the editor.
      if (!configuration?.id || isNil(name) || isNil(shortName))
        return configurationMap

      const matchingConfiguration = editedMarkConfigurations.find(candidate =>
        candidate?.effectiveProperties?.name === name &&
        candidate?.effectiveProperties?.shortName === shortName)

      if (!matchingConfiguration?.id)
        return configurationMap

      return { ...configurationMap, [configuration.id]: matchingConfiguration.id }
    }, {} as Record<string, string>)
}

export const getMarkConfigurationsMapToEditedCourse = createSelector(
  getAllCoursesForSelectedEvent,
  getEditedCourse,
  mapMarkConfigurationsToEditedCourse)

export const getLinesAndGateOptionsForCurrentEventAndWaypoint = createSelector(
  isSelectedWaypointLineOrGate,
  getAllCoursesForSelectedEvent,
  getMarkConfigurationsMapToEditedCourse,
  getEditedCourse,
  (isSelectedWaypointLineOrGate, eventCourses, markConfigurationsMap, editedCourse) => {
    if (isSelectedWaypointLineOrGate)
      return []

    return compose(
      reject(isNil),
      map((waypoint: any) => {
        const markConfigurationIds = waypoint?.markConfigurationIds || []
        const mappedMarkConfigurationIds = markConfigurationIds.map(
          id => markConfigurationsMap[id])

        // Do not offer a line/gate from another race if one of its marks cannot
        // be mapped to the current edited course.
        if (mappedMarkConfigurationIds.some(isNil))
          return null

        return mergeRight(waypoint, {
          isWaypoint: true,
          markConfigurationIds: mappedMarkConfigurationIds
        })
      }),
      uniqBy(compose(
        reduce(concat, ''),
        values,
        pick(['controlPointName', 'controlPointShortName'])
      )),
      reject(compose(includes(__, ['Start', 'Finish']), prop('controlPointName'))),
      filter(compose(either(equals(PassingInstruction.Line), equals(PassingInstruction.Gate)), prop('passingInstruction'))),
      flatten,
      defaultTo([]),
      map(prop('waypoints')),
      append(editedCourse))(
      eventCourses)
  })
