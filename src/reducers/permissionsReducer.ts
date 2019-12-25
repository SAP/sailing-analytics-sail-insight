import { concat, compose, uniqBy, prop, always } from 'ramda'
import { handleActions } from 'redux-actions'
import { updatePermissions } from 'actions/permissions'
import { removeUserData } from 'actions/auth'

export default handleActions({
  [updatePermissions as any]: (state: any = [], action: any) =>
    compose(
      uniqBy(prop('permission')),
      concat(action.payload))(
      state),
  [removeUserData as any]: always([])
}, [])
