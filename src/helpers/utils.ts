import { isArray, isMatch, isObject, orderBy } from 'lodash'
import { Alert, ListView } from 'react-native'

import I18n from 'i18n'


export const getListViewDataSource = (data: any, sectionIds?: any[]) => {
  const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => (r1 !== r2),
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  })
  return isArray(data) ?
  dataSource.cloneWithRows(data) :
  dataSource.cloneWithRowsAndSections(data,  sectionIds)
}

export const notImplementedYetAlert = () => {
  Alert.alert(I18n.t('text_not_implemented_yet'))
}

export const listKeyExtractor = (item: any, index: number) => `${JSON.stringify(item)}${index}`


export const extractResizeModeFromStyle: (s: any) => {resizeMode?: any, stripped: any} = (style: any) => {
  if (isArray(style)) {
    let tempMode: any
    const strippedStyles = style.map((item: any) => {
      if (!item) {
        return item
      }
      const { resizeMode, ...stripped } = item
      tempMode = resizeMode || tempMode
      return stripped
    })
    return { resizeMode: tempMode, stripped: strippedStyles }
  }
  if (isObject(style)) {
    const { resizeMode, ...stripped } = style
    return { stripped, resizeMode }
  }
  return {
    stripped: style,
  }
}

export const hasSameValues = (objA: any, objB: any) => {
  if (!objA || !objB) {
    return false
  }
  return isMatch(objA, objB)
}

export function getOrderListFunction<Type = any>(valueKeys: string[], order?: 'asc' | 'desc') {
  return (list: Type[]) => orderBy(list, valueKeys, [order as string])
}

export const spreadableList = (condition: any, ...params: any[]) => condition ? params : []
