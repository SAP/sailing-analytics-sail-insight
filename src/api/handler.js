import { normalize } from 'normalizr'

import Logger from 'helpers/Logger'
import * as networking from './networking'

import ApiException from './ApiException'
import { getUrl } from './config'

/**
 * extract json data from response
 * @param {*} response object
 */
const responseData = async (response) => {
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
    throw new ApiException(data?.message || data?.detail || 'unknown_error', response.status, data)
  }
  try {
    return await response.json()
  } catch (err) {
    Logger.debug('JSON Response error:', err)
  }
  return null
}

const responseDataArray = async (response, options) => {
  const data = await responseData(response, options)
  return data || []
}

/**
 * get request function with specific response data handler
 * @param {*} responseHandler function to extract the data from response
 */
const requestWithHandler = responseHandler => async (path, options, dataSchema) => {
  const response = await networking.request(getUrl(path), options)
  const data = responseHandler ? await responseHandler(response) : response
  return dataSchema && data ? normalize(data, dataSchema) : data
}


export const dataRequest = requestWithHandler(responseData)
export const request = requestWithHandler()
export const listRequest = requestWithHandler(responseDataArray)
