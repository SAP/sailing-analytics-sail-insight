import { normalize } from 'normalizr'

import Logger from 'helpers/Logger'
import * as networking from './networking'

import ApiException from './ApiException'

/**
 * extract json data from response
 * @param {*} response object
 */
const responseData = async (response: any) => {
  if (!response) {
    return null
  }
  if (!response.ok) {
    let data = null
    try {
      data = response.status !== 404 ? await response.json() : { message: 'NOT FOUND' }
    } catch (err) {
      data = err
    }
    throw new ApiException(data && (data.message || data.detail || 'unknown_error'), response.status, data)
  }
  try {
    return await response.json()
  } catch (err) {
    Logger.debug('JSON Response error:', err)
  }
  return null
}

const responseDataArray = async (response: any) => {
  const data = await responseData(response)
  return data || []
}

/**
 * get request function with specific response data handler
 * @param {*} responseHandler function to extract the data from response
 */
const requestWithHandler = (responseHandler?: (response: any) => void) => async (
  url: string,
  options?: any,
  dataSchema?: any,
) => {
  const response = await networking.request(url, options)
  const data = responseHandler ? await responseHandler(response) : response
  return dataSchema && data ? normalize(data, dataSchema) : data
}


export const dataRequest = requestWithHandler(responseData)
export const request = requestWithHandler()
export const listRequest = requestWithHandler(responseDataArray)
