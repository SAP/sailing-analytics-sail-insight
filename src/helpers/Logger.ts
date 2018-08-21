/* eslint-disable */

import { isUndefined, keys } from 'lodash'

import { DEV_MODE } from './environment'


const envAction = (logAction: ((...args: any[]) => void)) => (DEV_MODE ? logAction : () => {})

export default {
  log: console.log,
  error: envAction(console.error),
  debug: envAction(console.log),
  warn: envAction(console.warn),
  groupedDebug: envAction((message, data = {}) => {
    if (console.groupCollapsed) {
      console.groupCollapsed(message)
    } else {
      console.log(message)
    }
    keys(data).forEach((property) => {
      const value = data[property]
      if (isUndefined(value)) {
        return
      }
      console.log(property, value)
    })
    if (console.groupEnd) { console.groupEnd() }
  }),
}
