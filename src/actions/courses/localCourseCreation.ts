import { compose } from 'ramda'
import { getFormValues } from 'redux-form'
import uuidv4 from 'uuid/v4'

import { DispatchType, GetStateType } from 'helpers/types'

import {
  COURSE_CONFIG_FORM_NAME,
  waypointFromFormValues,
} from 'forms/courseConfig'

import { saveWaypoint, updateControlPoint } from 'actions/courses'
import {
  ControlPoint,
  ControlPointClass,
  ControlPointState,
  Mark,
} from 'models/Course'

export const assignControlPointClass = (controlPointClass: ControlPointClass) =>
  updateControlPoint({
    class: controlPointClass,
    id: controlPointClass === ControlPointClass.MarkPair ? uuidv4() : undefined,
  })

const assignControlPointState = (controlPoint: ControlPointState) =>
  updateControlPoint(controlPoint)

const controlPointToControlPointState = (
  controlPoint: ControlPoint,
): ControlPointState => ({
  id: controlPoint.id,
  ...(controlPoint.class === ControlPointClass.Mark
    ? { class: controlPoint.class }
    : {
        class: controlPoint.class,
        leftMark: controlPoint.leftMark && controlPoint.leftMark.id,
        rightMark: controlPoint.rightMark && controlPoint.rightMark.id,
      }),
})

export const assignControlPoint = (controlPoint: ControlPoint) => compose(
  assignControlPointState,
  controlPointToControlPointState,
)(controlPoint)

export const saveWaypointFromForm = () => (
  dispatch: DispatchType,
  getState: GetStateType,
) => {
  const { leftMark, rightMark, passingInstruction, markPairLongName } = compose(
    waypointFromFormValues,
    getFormValues(COURSE_CONFIG_FORM_NAME),
  )(getState())

  const marks: Mark[] = [leftMark, rightMark]

  dispatch(saveWaypoint({ marks, passingInstruction, markPairLongName }))
}
