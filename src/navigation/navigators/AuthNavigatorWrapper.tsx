import React from 'react'
import { connect } from 'react-redux'

import { NavigationContainer, NavigationScreenProps } from 'react-navigation'
import { isLoggedIn as isLoggedInSelector } from 'selectors/auth'


type FactoryMethod = (isLoggedIn: boolean) => NavigationContainer

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedInSelector(state),
})

// HINT: unfortunate but quick workaround for returning navigators with different Tabs based on redux state
// adding router is necessary to maintain navigation/routing capabilities from within wrapped navigator
export default (factoryMethod: FactoryMethod) => connect(mapStateToProps)(
  class AuthNavigatorWrapper extends React.Component<NavigationScreenProps & {
    isLoggedIn: boolean,
  }> {

    public getNavContainerWithRouter = (Navigator: any) => {
      const navContainer: any = (props: any) => <Navigator/>
      navContainer.router = Navigator.router
      return navContainer
    }

    public render() {
      const NavContainer = this.getNavContainerWithRouter(factoryMethod(this.props.isLoggedIn))
      return <NavContainer/>
    }
  },
)
