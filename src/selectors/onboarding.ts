import { get } from 'lodash'

import { isExpired } from 'helpers/date'
import { ONBOARDING_REDUCER_NAME, OnboardingReducerKeys } from 'reducers/config'


const EXPIRIRATION_LIMIT_IN_HOURS = 48

const isDismissalExpired = (key: string) => (state: any) =>
  isExpired(get(state, `${ONBOARDING_REDUCER_NAME}.${key}`), EXPIRIRATION_LIMIT_IN_HOURS)

export const isJoinRegattaDismissalExpired = isDismissalExpired(OnboardingReducerKeys.JOIN_DISMISSED_AT_KEY)
export const isCreateAccountDismissalExpired = isDismissalExpired(OnboardingReducerKeys.ACCOUNT_DISMISSED_AT_KEY)
