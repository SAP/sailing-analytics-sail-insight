import { normalize } from 'normalizr'

import Logger from 'helpers/Logger'
import * as networking from './networking'

import ApiException from './ApiException'


const defaultResponseHandler = (dataHandler?: (response: any) => any) => async (response: any) => {
  if (!response) {
    return null
  }
  if (!response.ok) {
    let data = null
    if (response.status === 404) {
      data = { message: 'NOT FOUND' }
    }
    if (dataHandler) {
      data = await dataHandler(response)
    }
    throw new ApiException(data && (data.message || data.detail || 'unknown_error'), response.status, data)
  }
  try {
    return dataHandler ? dataHandler(response) : response
  } catch (err) {
    Logger.debug('JSON Response error:', err)
  }
  return null
}

const jsonData = async (response: any) => {
  try {
    return await response.json()
  } catch (err) {
    Logger.debug('JSON Response error:', err)
    return err
  }
}

const jsonDataArray = async (response: any) => {
  const data = await jsonData(response)
  return data || []
}

/**
 * get request function with specific response data handler
 * @param {*} responseHandler function to extract the data from response
 */
const requestWithHandler = (dataHandler?: (response: any) => any) => async (
  url: string,
  allOptions: RequestHandlerOptions = {},
) => {
  const { dataSchema, processData, ...options } = allOptions
  const response = await networking.request(url, options)
  let data = await defaultResponseHandler(dataHandler)(response)
  data = processData ? processData(data) : data
  return dataSchema && data ? normalize(data, dataSchema) : data
}


export interface RequestHandlerOptions extends networking.RequestOptions {
  dataSchema?: any
  processData?: (data: any) => any
}

export const dataRequest = requestWithHandler(jsonData)
export const request = requestWithHandler()
export const listRequest = requestWithHandler(jsonDataArray)
