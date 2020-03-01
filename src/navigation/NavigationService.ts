import { isString } from 'lodash'
import { CommonActions, StackActions } from '@react-navigation/native'

let navigator: any

export const setTopLevelNavigator = (navigatorRef: any) => {
  navigator = navigatorRef
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
  if (!params) {
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
