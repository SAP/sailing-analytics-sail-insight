import { isString } from 'lodash'
import { NavigationActions, StackActions } from 'react-navigation'

let navigator: any

export const setTopLevelNavigator = (navigatorRef: any) => {
  navigator = navigatorRef
}

export const navigate = (routeName: string, params?: any) => {
  if (!navigator) {
    return
  }

  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  )
}

export const navigateBack = (params?: any) => {
  if (!navigator) {
    return
  }
  navigator.dispatch(NavigationActions.back(params))
}

export const navigateWithReset = (route: string | string[] , index: number = 0) => {
  if (!navigator) {
    return
  }

  const routes: string[] = isString(route) ? [route] : route

  navigator.dispatch(StackActions.reset({
    index,
    actions: routes.map(routeName => NavigationActions.navigate({ routeName })),
  }))
}
