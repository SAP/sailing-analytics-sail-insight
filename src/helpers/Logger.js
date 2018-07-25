/* eslint-disable */

import { get, keys } from 'lodash'

import {DEV_MODE} from './environment';


const envAction = logAction => (DEV_MODE ? logAction : () => {})

export default {
  log: console.log,
  error: envAction(console.error),
  debug: envAction(console.log),
  warn: envAction(console.warn),
  groupedDebug: envAction((data = {}, title) => {
    if (console.groupCollapsed) {
      console.groupCollapsed(title)
    } else {
      console.log(title)
    }
    keys(data).forEach((element) => {
      console.log(element, data[element])
    })
    if (console.groupEnd) { console.groupEnd() }
  }),
}
