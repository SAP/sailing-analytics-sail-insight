import React from 'react'
import { connect } from 'react-redux'
import {
  isLoggedIn as isLoggedInSelector,
} from '../../selectors/auth'

class AuthComponentSelector extends React.Component<{
  isLoggedIn: boolean,
  LoggedInComponent: any,
  NotLoggedInComponent: any,
}> {
  public render() {
    const { isLoggedIn, LoggedInComponent, NotLoggedInComponent } = this.props

    if (isLoggedIn) {
      return <LoggedInComponent />
    }

    return <NotLoggedInComponent />
  }
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps)(AuthComponentSelector)
