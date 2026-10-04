import React from 'react'
import { connect } from 'react-redux'

import ErrorDetails from 'components/ErrorDetails'
import { getErrorDetails } from 'helpers/texts'
import { getShowErrorDetailsSetting } from 'selectors/settings'

/**
 * Renders the ErrorDetails of a raw error, only when the
 * "show technical error details" expert setting is on.
 */
const ConnectedErrorDetails = ({ enabled, error }: { enabled: boolean, error?: any }) =>
  enabled && error ? <ErrorDetails details={getErrorDetails(error)} /> : null

export default connect((state: any) => ({ enabled: getShowErrorDetailsSetting(state) }))(ConnectedErrorDetails) as
  React.ComponentType<{ error?: any }>
