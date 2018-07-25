import { NavigationActions } from 'react-navigation'

let navigator

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef
}

function navigate(routeName, params) {
  console.log('render')
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  )
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
}
