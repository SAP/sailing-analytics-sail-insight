import { NavigationActions } from 'react-navigation'

let navigator: any

function setTopLevelNavigator(navigatorRef: any) {
  navigator = navigatorRef
}

function navigate(routeName: string, params?: any) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  )
}

function navigateBack(params: any) {
  navigator.dispatch(NavigationActions.back(params))
}

// add other navigation functions that you need and export them

export default {
  navigate,
  navigateBack,
  setTopLevelNavigator,
}
