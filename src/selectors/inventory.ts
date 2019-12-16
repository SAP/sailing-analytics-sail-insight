import { compose, find, reduce, concat, props, equals,
  prop, __, defaultTo, curry, when, has, propEq } from 'ramda'
import { getEntityArrayByType} from './entity'
import { createSelector } from 'reselect'
import { getEditedCourse } from './course'

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
    markProperties.map(findMarkConfigurationByMarkPropertiesCombinedName(course.markConfigurations)))

export const getMarkPropertiesOrMarkForCourseByName = name => createSelector(
  getMarkPropertiesAndMarksOptionsForCourse,
  find(compose(
    propEq('name', name),
    when(has('effectiveProperties'), prop('effectiveProperties')))))
