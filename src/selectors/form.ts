import { get } from 'lodash'
import { getFormSyncErrors, getFormValues as getValues } from 'redux-form'


export const getFieldError = (formName: string, fieldName: string) => (state: any) =>
  get(getFormSyncErrors(formName)(state), fieldName)

export const getFormValues = (formName: string) => getValues(formName)

export const getFormFieldValue = (formName: string, fieldName: string) => (state: any) =>
  get(getFormValues(formName)(state), fieldName)
