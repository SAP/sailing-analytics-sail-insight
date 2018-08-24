import { NavigationActions } from 'react-navigation'

let navigator: any

export const setTopLevelNavigator = (navigatorRef: any) => {
  navigator = navigatorRef
}

export const navigate = (routeName: string, params?: any) => {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  )
}

export const navigateBack = (params?: any) => {
  navigator.dispatch(NavigationActions.back(params))
}

