import { get } from 'lodash'


export const getScreenParamsFromProps = (props: any) => get(
  props,
  'navigation.state.params',
)

export const getCustomScreenParamData = (props: any) =>
  get(getScreenParamsFromProps(props), 'data')
