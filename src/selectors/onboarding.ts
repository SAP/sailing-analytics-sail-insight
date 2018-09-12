import { get } from 'lodash'
import moment from 'moment'

import { ONBOARDING_REDUCER_NAME, OnboardingReducerKeys } from 'reducers/config'


const EXPIRIRATION_LIMIT_IN_HOURS = 48

const isDismissalExpired = (key: string) => (state: any) => {
  const dateText = get(state, `${ONBOARDING_REDUCER_NAME}.${key}`)
  if (!dateText) {
    return true
  }
  return moment(dateText).utc().add(EXPIRIRATION_LIMIT_IN_HOURS, 'hour').isBefore(moment().utc())
}


export const isJoinRegattaDismissalExpired = isDismissalExpired(OnboardingReducerKeys.JOIN_DISMISSED_AT_KEY)
export const isCreateAccountDismissalExpired = isDismissalExpired(OnboardingReducerKeys.ACCOUNT_DISMISSED_AT_KEY)
