import { get } from 'lodash'
import { FORM_REDUCER_NAME } from 'reducers/config'


export const getFieldError = (state: any, formName: string, fieldName: string) =>
  get(state, `${FORM_REDUCER_NAME}.${formName}.syncErrors.${fieldName}`)
