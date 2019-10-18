import { createAction } from 'redux-actions'
import { DispatchType, GetStateType } from 'helpers/types'
import { removeEntity } from './entities'

import { Mark } from 'models/Course'

export const LOAD_MARK_INVENTORY = 'LOAD_MARK_INVENTORY'

export const loadMarkInventory  = createAction(LOAD_MARK_INVENTORY)
export const deleteMark = (mark: Mark) => (dispatch: DispatchType, getState: GetStateType) => {
    dispatch(removeEntity({ entityType: 'mark', id: mark.id }))
}