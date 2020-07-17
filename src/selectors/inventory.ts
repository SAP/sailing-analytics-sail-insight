import { compose, find, reduce, concat, props, equals,
  prop, __, defaultTo, curry, when, has, propEq, map,
  always, not, includes, reject, flatten, partition, reverse,
  addIndex, sortBy, indexOf, unless, isNil, merge } from 'ramda'
import { getEntityArrayByType} from './entity'
import { createSelector } from 'reselect'
import { getEditedCourse, hasSameStartFinish } from './course'

import { MARK_PROPERTIES_ENTITY_NAME } from 'api/schemas'

const mapIndexed = addIndex(map)

const startFinishMarks = ['Start/Finish Pin', 'Start/Finish Boat', 'Start Pin', 'Start Boat', 'Finish Pin', 'Finish Boat']

export const getMarkProperties = (state: any) => compose(
  flatten,
  reverse,
  mapIndexed((set, index) =>
    when(
      always(equals(0, index)),
      sortBy(compose(indexOf(__, startFinishMarks), prop('name'))),
      set)),
  partition(compose(includes(__, startFinishMarks), prop('name'))))(
  getEntityArrayByType(state, MARK_PROPERTIES_ENTITY_NAME))

const combinedNames = compose(
  reduce(concat, ''),
  props(['name', 'shortName']),
  when(has('effectiveProperties'), prop('effectiveProperties')))

const markConfigurationHasCombinedName = name => compose(
  equals(name),
  combinedNames,
  when(has('effectiveProperties'), prop('effectiveProperties')))

const findMarkConfigurationByMarkPropertiesCombinedName =
  curry((markConfigurations, markProperties) =>
    compose(
      defaultTo(markProperties),
      unless(isNil, merge({ isMarkConfiguration: true })),
      find(__, markConfigurations),
      markConfigurationHasCombinedName,
      combinedNames)(
      markProperties))

export const getMarkPropertiesAndMarksOptionsForCourse = createSelector(
  getEditedCourse,
  getMarkProperties,
  (course, markProperties) =>
    map(findMarkConfigurationByMarkPropertiesCombinedName(course.markConfigurations),
    markProperties))

export const getFilteredMarkPropertiesAndMarksOptionsForCourse = createSelector(
  getMarkPropertiesAndMarksOptionsForCourse,
  hasSameStartFinish,
  (marksOrMarkProperties, hasSameStartFinish) =>
    compose(
      reject(compose(
        when(always(not(hasSameStartFinish)), includes(__, ['Start/Finish Pin', 'Start/Finish Boat'])),
        when(always(hasSameStartFinish), includes(__, ['Start Pin', 'Start Boat', 'Finish Pin', 'Finish Boat'])),
        prop('name'),
        when(has('effectiveProperties'), prop('effectiveProperties')))),
      sortBy(combinedNames))
    (marksOrMarkProperties))

export const getMarkPropertiesOrMarkForCourseByName = name => createSelector(
  getMarkPropertiesAndMarksOptionsForCourse,
  find(compose(
    propEq('name', name),
    when(has('effectiveProperties'), prop('effectiveProperties')))))
