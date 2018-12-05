import { get } from 'lodash'

import { isExpired } from 'helpers/date'
import { RootState } from 'reducers/config'


const EXPIRIRATION_LIMIT_IN_HOURS = 48

const isDismissalExpired = (key: string) => (state: RootState = {}) =>
  isExpired(get(state.onboarding, key), EXPIRIRATION_LIMIT_IN_HOURS)

export const isJoinRegattaDismissalExpired = isDismissalExpired('joinRegattaDismissedAt')
export const isCreateAccountDismissalExpired = isDismissalExpired('createAccountDismissedAt')
