import { handleActions } from 'redux-actions'

import { dismissCreateAccountOnboarding, dismissJoinRegattaOnboarding } from 'actions/onboarding'
import { timestampUpdateHandler } from 'helpers/reducers'
import { OnboardingState } from 'reducers/config'


const initialState: OnboardingState = {
  joinRegattaDismissedAt: null,
  createAccountDismissedAt: null,
}

const reducer = handleActions(
  {
    [dismissJoinRegattaOnboarding as any]: timestampUpdateHandler('joinRegattaDismissedAt'),
    [dismissCreateAccountOnboarding as any]: timestampUpdateHandler('createAccountDismissedAt'),
  },
  initialState,
)

export default reducer
