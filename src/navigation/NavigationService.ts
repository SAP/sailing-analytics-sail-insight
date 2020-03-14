import { CommonActions, StackActions } from '@react-navigation/native'

let navigator: any

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