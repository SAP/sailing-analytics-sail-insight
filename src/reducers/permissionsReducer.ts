import { concat, compose, uniqBy, prop } from 'ramda'
import { handleActions } from 'redux-actions'
import { updatePermissions } from 'actions/permissions'

export default handleActions({
  [updatePermissions as any]: (state: any = [], action: any) =>
    compose(
      uniqBy(prop('permission')),
      concat(action.payload))(
      state)
}, [])
