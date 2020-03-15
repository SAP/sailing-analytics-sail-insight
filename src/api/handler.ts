import { normalize } from 'normalizr'

import ApiDataException from './ApiDataException'
import ApiException from './ApiException'
import AuthException from './AuthException'
import { ERR_NOT_FOUND, ERR_UNAUTHORIZED, ERR_UNKNOWN, STATUS_NOT_FOUND, STATUS_UNAUTHORIZED } from './constants'
import * as networking from './networking'


const getData = async (dataHandler?: (r: any) => any, response?: any) => {
  try {
    return dataHandler ? await dataHandler(response) : response
  } catch (err) {
    throw ApiDataException.create(err)
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
        throw AuthException.create(data || ERR_UNAUTHORIZED)
      default:
        throw ApiException.create(
          data || ERR_UNKNOWN,
          response.status,
          data,
        )
    }

  }
  return getData(dataHandler, response)
}

const jsonData = async (response: any) => {
  if (response.text) {
    console.log('jsonData - text')
    const text = await response.text()
    return text && JSON.parse(text)
  }
  console.log('jsonData - obj')
  return response
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
