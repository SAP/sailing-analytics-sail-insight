import { handleActions } from 'redux-actions'

import { dismissCreateAccountOnboarding, dismissJoinRegattaOnboarding } from 'actions/onboarding'
import { timestampUpdateHandler } from 'helpers/reducers'
import { OnboardingReducerKeys } from 'reducers/config'


const initialState = {
  [OnboardingReducerKeys.JOIN_DISMISSED_AT_KEY]: null,
  [OnboardingReducerKeys.ACCOUNT_DISMISSED_AT_KEY]: null,
}

const reducer = handleActions(
  {
    [dismissJoinRegattaOnboarding as any]: timestampUpdateHandler(OnboardingReducerKeys.JOIN_DISMISSED_AT_KEY),
    [dismissCreateAccountOnboarding as any]: timestampUpdateHandler(OnboardingReducerKeys.ACCOUNT_DISMISSED_AT_KEY),
  },
  initialState,
)

export default reducer
