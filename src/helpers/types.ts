import { GestureResponderEvent } from 'react-native'


export type DispatchType = (action: any) => any
export type GetStateType = () => any
export type DeepLinkListenerType = (params: any) => void
export type ShowActionSheetType = (...args: any[]) => void
export type OnPressType = (event: GestureResponderEvent) => void
export type RenderRowType = (
  rowData: any,
  sectionID: string | number,
  rowID: string | number,
  highlightRow?: boolean,
) => React.ReactElement<any>
export type AutoCourseUpdateState = 'MISSING' | 'IN_PROGRESS' | 'DONE'
