import { ListView } from 'react-native'

export const getListViewDataSource = (items: any[] = []) => {
  let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => (r1 !== r2),
  })
  dataSource = dataSource.cloneWithRows(items)
  return dataSource
}
