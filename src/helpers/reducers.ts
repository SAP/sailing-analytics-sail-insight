import moment from 'moment'


export const itemUpdateHandler = (itemKey: string) => (state: any = {}, action: any) => ({
  ...state,
  [itemKey]: action && action.payload,
})

export const timestampUpdateHandler = (itemKey: string) => (state: any = {}) => ({
  ...state,
  [itemKey]: moment().utc().format(),
})
