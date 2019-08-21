import { prop, __ } from 'ramda'

import { createSelector } from 'reselect'
import uuidv4 from 'uuid/v4'

import {
  ControlPointClass,
  GateSide,
  Mark,
  MarkType,
  PassingInstruction,
} from 'models/Course'
import { getSelectedWaypoint } from 'selectors/course'

export const COURSE_CONFIG_FORM_NAME = 'courseConfig'
export const FORM_WAYPOINT_SECTION_NAME = 'waypoint'

export const FORM_ROUNDING_DIRECTION = 'roundingDirection'
export const FORM_MARK_PAIR_LONG_NAME = 'markPairLongName'
export const FORM_LOCATION = 'location'

export const FORM_MARK_ID = 'id'
export const FORM_MARK_SHORT_NAME = 'shortName'
export const FORM_MARK_LONG_NAME = 'longName'

const sectionNameByGateSide = {
  [GateSide.LEFT]: 'leftMark',
  [GateSide.RIGHT]: 'rightMark'
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
  leftMark: markFromFormSection(values[sectionNameByGateSide[GateSide.LEFT]]),
  rightMark: markFromFormSection(values[sectionNameByGateSide[GateSide.RIGHT]]),
  passingInstruction: values[FORM_ROUNDING_DIRECTION],
  markPairLongName: 'New Gate Name REPlACE ME WHEN THERE IS AN INPUT FOR GATE NAME',
})

const markFormValuesFromMark = (mark: any) => mark && ({
  [FORM_MARK_ID]: mark.id,
  [FORM_MARK_SHORT_NAME]: mark.shortName,
  [FORM_MARK_LONG_NAME]: mark.longName,
  [FORM_LOCATION]: mark.position
})

const formValuesFromWaypoint = (waypoint: any) => waypoint && waypoint.controlPoint && ({
  [FORM_ROUNDING_DIRECTION]:
    waypoint.passingInstruction || // The || is for the default passingInstruction
    (waypoint.controlPoint.class === ControlPointClass.Mark
      ? PassingInstruction.Port
      : PassingInstruction.Gate),
  [FORM_MARK_PAIR_LONG_NAME]:
    waypoint.controlPoint.class === ControlPointClass.MarkPair
      ? waypoint.controlPoint.longName
      : '',
  ...(waypoint.controlPoint.class === ControlPointClass.Mark
    ? {
      [sectionNameByGateSide[GateSide.LEFT]]: markFormValuesFromMark(waypoint.controlPoint),
    }
    : {
      [sectionNameByGateSide[GateSide.LEFT]] : markFormValuesFromMark(waypoint.controlPoint.leftMark),
      [sectionNameByGateSide[GateSide.RIGHT]]: markFormValuesFromMark(waypoint.controlPoint.rightMark),
    }),
})

export const getFormInitialValues = createSelector(
  getSelectedWaypoint,
  formValuesFromWaypoint,
)

export const courseConfigCommonFormSettings = {
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
