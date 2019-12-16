import { compose, find, reduce, concat, props, equals,
  prop, __, defaultTo, curry, when, has, propEq, map,
  always, not, includes, reject } from 'ramda'
import { getEntityArrayByType} from './entity'
import { createSelector } from 'reselect'
import { getEditedCourse, hasSameStartFinish } from './course'

import { MARK_PROPERTIES_ENTITY_NAME } from 'api/schemas'

export const getMarkProperties = (state: any) =>
  getEntityArrayByType(state, MARK_PROPERTIES_ENTITY_NAME)

const combinedNames = compose(
  reduce(concat, ''),
  props(['name', 'shortName']))

const markConfigurationHasCombinedName = name => compose(
  equals(name),
  combinedNames,
  prop('effectiveProperties'))

const findMarkConfigurationByMarkPropertiesCombinedName =
  curry((markConfigurations, markProperties) =>
    compose(
      defaultTo(markProperties),
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
    reject(compose(
      when(always(not(hasSameStartFinish)), includes(__, ['Start/Finish Pin', 'Start/Finish Boat'])),
      when(always(hasSameStartFinish), includes(__, ['Start Pin', 'Start Boat', 'Finish Pin', 'Finish Boat'])),
      prop('name'),
      when(has('effectiveProperties'), prop('effectiveProperties'))),
    marksOrMarkProperties))

export const getMarkPropertiesOrMarkForCourseByName = name => createSelector(
  getMarkPropertiesAndMarksOptionsForCourse,
  find(compose(
    propEq('name', name),
    when(has('effectiveProperties'), prop('effectiveProperties')))))
