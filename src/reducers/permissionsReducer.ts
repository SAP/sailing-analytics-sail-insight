import { concat, compose, uniqBy, prop, always, isEmpty, reject, defaultTo } from 'ramda'
import { handleActions } from 'redux-actions'
import { updateEventPermissions } from 'actions/permissions'
import { removeUserData } from 'actions/auth'

export default handleActions({
  [updateEventPermissions as any]: (state: any = [], action: any) =>
    compose(
      uniqBy(prop('permission')),
      reject(isEmpty),
      concat(defaultTo([{}], action.payload)))(
      state),
  [removeUserData as any]: always([])
}, [])
