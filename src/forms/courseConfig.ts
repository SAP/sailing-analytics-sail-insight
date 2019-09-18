import { prop, __, when, either, isNil, equals, always, ifElse } from 'ramda'
import { isObject, values } from 'lodash'

import { getFormSyncErrors } from 'redux-form'
import { createSelector } from 'reselect'
import uuidv4 from 'uuid/v4'

import { ControlPointClass, GateSide, Mark, MarkType, PassingInstruction } from 'models/Course'
import { getSelectedWaypoint } from 'selectors/course'
import { validateRequired } from './validators'

export const COURSE_CONFIG_FORM_NAME = 'courseConfig'

export const FORM_PASSING_INSTRUCTION = 'passingInstruction'
export const FORM_LOCATION = 'location'

export const FORM_MARK_ID = 'id'
export const FORM_MARK_SHORT_NAME = 'shortName'
export const FORM_MARK_LONG_NAME = 'longName'
export const FORM_MARK_PAIR_SHORT_NAME = 'markPairShortName'
export const FORM_MARK_PAIR_LONG_NAME = 'markPairLongName'

const FORM_CONTROL_POINT_CLASS = 'controlPointClass'

const LEFT_MARK_SECTION = 'leftMark'
const RIGHT_MARK_SECTION = 'rightMark'

const sectionNameByGateSide = {
  [GateSide.LEFT]: LEFT_MARK_SECTION,
  [GateSide.RIGHT]: RIGHT_MARK_SECTION
}

export const formMarkSectionNameByGateSide = prop(__, sectionNameByGateSide)

export const markFromFormSection = (values: any): Mark | undefined =>
  values && ({
    class: ControlPointClass.Mark,
    id: values[FORM_MARK_ID] || uuidv4(),
    longName: values[FORM_MARK_LONG_NAME],
    shortName: values[FORM_MARK_SHORT_NAME],
    type: MarkType.Buoy,
  })

export const waypointFromFormValues = (values: any) => ({
  leftMark: markFromFormSection(values[LEFT_MARK_SECTION]),
  rightMark: markFromFormSection(values[RIGHT_MARK_SECTION]),
  passingInstruction: values[FORM_PASSING_INSTRUCTION],
  markPairLongName: values[FORM_MARK_PAIR_LONG_NAME],
})

const markFormValuesFromMark = (mark: any) => mark && ({
  [FORM_MARK_ID]: mark.id,
  [FORM_MARK_SHORT_NAME]: mark.shortName,
  [FORM_MARK_LONG_NAME]: mark.longName,
  [FORM_LOCATION]: mark.position
})

const formValuesFromWaypoint = (waypoint: any) => waypoint && waypoint.controlPoint && ({
  [FORM_PASSING_INSTRUCTION]: 
    when(either(isNil, equals('None')),
      ifElse(
        always(equals(waypoint.controlPoint.class, ControlPointClass.Mark)),
        always(PassingInstruction.Port),
        always(PassingInstruction.Gate)))(
      waypoint.passingInstruction),
  // MarkPairLongName
  [FORM_CONTROL_POINT_CLASS]: waypoint.controlPoint.class,
  [FORM_MARK_PAIR_LONG_NAME]:
    waypoint.controlPoint.class === ControlPointClass.MarkPair
      ? waypoint.controlPoint.longName
      : '',
  [FORM_MARK_PAIR_SHORT_NAME]:
    waypoint.controlPoint.class === ControlPointClass.MarkPair
      ? waypoint.controlPoint.shortName
      : '',
  ...(waypoint.controlPoint.class === ControlPointClass.Mark
    ? {
      [LEFT_MARK_SECTION]: markFormValuesFromMark(waypoint.controlPoint),
    }
    : {
      [LEFT_MARK_SECTION] : markFormValuesFromMark(waypoint.controlPoint.leftMark),
      [RIGHT_MARK_SECTION]: markFormValuesFromMark(waypoint.controlPoint.rightMark)
    }),
})

export const getFormInitialValues = createSelector(
  getSelectedWaypoint,
  formValuesFromWaypoint,
)

// This is needed because form validation doesn't work for fields which are not
// rendered. See:
// https://redux-form.com/8.2.2/examples/syncvalidation/
// https://github.com/erikras/redux-form/issues/2321
export const getFormIsValid = (state: any) =>
  values(getFormSyncErrors(COURSE_CONFIG_FORM_NAME)(state)).every(
    (field: any) =>
      isObject(field)
        ? values(field).every((sectionField: any) => !sectionField)
        : !field,
  )

const validateMarkSection = (values: any = {}) => ({
  [FORM_MARK_LONG_NAME]: validateRequired(values[FORM_MARK_LONG_NAME]),
})

const validate = (values: any = {}) => ({
  [LEFT_MARK_SECTION]: validateMarkSection(values[LEFT_MARK_SECTION]),
  ...(values[FORM_CONTROL_POINT_CLASS] === ControlPointClass.MarkPair
    ? { [RIGHT_MARK_SECTION]: validateMarkSection(values[RIGHT_MARK_SECTION]) }
    : {}
  ),
})

export const courseConfigCommonFormSettings = {
  validate,
  form: COURSE_CONFIG_FORM_NAME,
  destroyOnUnmount: false,        // <-- preserve form data across different steps
  enableReinitialize: true
}

const initalLocation = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 1,
  longitudeDelta: 1,
}
