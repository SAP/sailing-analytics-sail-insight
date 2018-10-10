/* tslint:disable:no-console */


export const SERVER_URL = process.env.SERVER_URL
export const DATA_API_PREFIX = process.env.DATA_API_PREFIX
export const AUTH_API_PREFIX = process.env.AUTH_API_PREFIX

export const init = () => {
  // initializations for dev build
  console.disableYellowBox = true
}

