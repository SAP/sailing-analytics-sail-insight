import { isArray } from 'lodash'
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
