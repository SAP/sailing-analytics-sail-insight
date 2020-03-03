import { isString } from 'lodash'
import { CommonActions, StackActions } from '@react-navigation/native'

let navigator: any

export const setTopLevelNavigator = (navigatorRef: any) => {
  navigator = navigatorRef
}

const findInnerState = (routes: any, routeName: string) => {
  for(var i = 0; i < routes.length; i++) {
      const route = routes[i]
      if (route.name === routeName) {
          return route;
      } else if (route.state && route.state.routes && route.state.routes.length > 0) {
          const result: any = findInnerState(route.state.routes, routeName)
          if (result) {
            return result
          }
      }
  }
  return false
}

export const getRootState = (routeName: string): any => {
  if (!navigator) {
    return null
  }

  const state = navigator.getRootState()
  if (state && state.routes) {
    return findInnerState(state.routes, routeName)
  }

  return null
}

export const navigate = (name: string, params?: any) => {
  if (!navigator) {
    return
  }

  if (params && params.data && params.data.replaceCurrentScreen) {
    navigator.dispatch(StackActions.replace(name, params))
  } else {
    navigator.dispatch(
      CommonActions.navigate({
        name,
        params
      }))
  }
}

export const pop = (params?: any) => {
  if (!navigator) {
    return
  }
  if (params) {
    navigator.dispatch(StackActions.pop(params))
  } else {
    navigator.dispatch(StackActions.popToTop())
  }
}

export const navigateBack = (params?: any) => {
  if (!navigator) {
    return
  }
  navigator.dispatch({...CommonActions.goBack(), source: params})
}

export const navigateWithReset = (route: string | string[] , index: number = 0, options?: {rootReset: boolean}) => {
  if (!navigator) {
    return
  }

  const routes: string[] = isString(route) ? [route] : route

  navigator.dispatch(CommonActions.reset({
    index: 1,
    routes: routes.map(name => { return { name }}),
    ...(options && options.rootReset ? { key: null } : {}),
  }))
}
