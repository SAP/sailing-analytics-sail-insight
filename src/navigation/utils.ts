import { get } from 'lodash'


export const getScreenParamsFromProps = (props: any) => get(
  props,
  'route.params',
)

export const getCustomScreenParamData = (props: any) =>
  get(getScreenParamsFromProps(props), 'data')

export const getCustomScreenParamOptions = (props: any) =>
  get(getScreenParamsFromProps(props), 'options')
