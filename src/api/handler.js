import Logger from 'helpers/Logger'
import * as networking from './networking'

import ApiException from './ApiException'
import { getUrl } from './config'


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


const requestWithHandler = responseHandler => async (path, options) => {
  const response = await networking.request(getUrl(path), options)
  const data = responseHandler ? await responseHandler(response) : response
  return data
}


export const dataRequest = requestWithHandler(responseData)
export const request = requestWithHandler()
export const listRequest = requestWithHandler(responseDataArray)
