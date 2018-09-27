import { normalize } from 'normalizr'

import ApiDataException from './ApiDataException'
import ApiException from './ApiException'
import AuthException from './AuthException'
import * as networking from './networking'

const STATUS_NOT_FOUND = 404
const STATUS_UNAUTHORIZED = 401

const ERR_NOT_FOUND = 'not_found'
const ERR_UNAUTHORIZED = 'unauthorized'
const ERR_UNKNOWN = 'unknown_error'

const getData = async (dataHandler?: (r: any) => any, response?: any) => {
  try {
    return dataHandler ? await dataHandler(response) : response
  } catch (err) {
    throw new ApiDataException(err)
  }
}

const getErrorData = async (response: any) => response && await response.text()

const defaultResponseHandler = (dataHandler?: (response: any) => any) => async (response: any) => {
  if (!response) {
    return null
  }
  if (!response.ok) {
    let data: any = response.status === STATUS_NOT_FOUND ? ERR_NOT_FOUND : undefined
    try {
      data = await getErrorData(response)
    } catch (err) {
      data = response
    }

    switch (response.status) {
      case STATUS_UNAUTHORIZED:
        throw new AuthException(data || ERR_UNAUTHORIZED, response.status)
      default:
        throw new ApiException(
          data || ERR_UNKNOWN,
          response.status,
          data,
        )
    }

  }
  return getData(dataHandler, response)
}

const jsonData = async (response: any) => response.json()

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
  const { dataSchema, dataProcessor, ...options } = allOptions
  const response = await networking.request(url, options)
  let data = await defaultResponseHandler(dataHandler)(response)
  data = dataProcessor ? dataProcessor(data) : data
  return dataSchema && data ? normalize(data, dataSchema) : data
}


export interface RequestHandlerOptions extends networking.RequestOptions {
  dataSchema?: any
  dataProcessor?: (data: any) => any
}

export const dataRequest = requestWithHandler(jsonData)
export const request = requestWithHandler()
export const listRequest = requestWithHandler(jsonDataArray)
