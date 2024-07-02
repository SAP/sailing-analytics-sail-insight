import { createAction } from 'redux-actions'

export const UPDATE_SHOW_EDIT_RESULTS_DISCLAIMER = 'UPDATE_SHOW_EDIT_RESULTS_DISCLAIMER'
export const UPDATE_SHOW_COPY_RESULTS_DISCLAIMER = 'UPDATE_SHOW_COPY_RESULTS_DISCLAIMER'

export const updateShowEditResultsDisclaimer     = createAction(UPDATE_SHOW_EDIT_RESULTS_DISCLAIMER)
export const updateShowCopyResultsDisclaimer     = createAction(UPDATE_SHOW_COPY_RESULTS_DISCLAIMER)
