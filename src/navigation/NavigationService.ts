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

  if (params && params.data && params.data.replaceCurrentScreen) {
    navigator.dispatch({
      key: routeName,
      type: 'replaceCurrentScreen',
      routeName,
      params
    })
  } else {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params
      }))
  }
}

export const pop = (params?: any) => {
  if (!navigator) {
    return
  }
  navigator.dispatch(StackActions.popToTop(params))
}

export const navigateBack = (params?: any) => {
  if (!navigator) {
    return
  }
  navigator.dispatch(NavigationActions.back(params))
}

export const navigateWithReset = (route: string | string[] , index: number = 0, options?: {rootReset: boolean}) => {
  if (!navigator) {
    return
  }

  const routes: string[] = isString(route) ? [route] : route

  navigator.dispatch(StackActions.reset({
    index,
    actions: routes.map(routeName => NavigationActions.navigate({ routeName })),
    ...(options && options.rootReset ? { key: null } : {}),
  }))
}
