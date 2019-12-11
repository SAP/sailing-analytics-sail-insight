import { createAction } from 'redux-actions'
import { DispatchType, GetStateType } from 'helpers/types'
import { removeEntity } from './entities'

export const LOAD_MARK_PROPERTIES = 'LOAD_MARK_PROPERTIES'

export const loadMarkProperties = createAction(LOAD_MARK_PROPERTIES)
export const deleteMarkProperties = markProperties => (dispatch: DispatchType, getState: GetStateType) => {
    dispatch(removeEntity({ entityType: 'markProperties', id: markProperties.id }))
}
