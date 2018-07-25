import { get, keys } from 'lodash'

const envAction = logAction => (__DEV__ ? logAction : () => {})

export default {
  log: console.log,
  error: envAction(console.error),
  debug: envAction(console.log),
  warn: envAction(console.warn),
  logRequestError: (error) => {
    if (__DEV__) {
      console.group(`Request Failed to ${get(error, 'response.url')}`)
      if (error.response) {
        console.log(get(error, 'response.body'))
        console.log(get(error, 'response.status'))
        console.log(get(error, 'response.headers'))
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Request sending failed')
        console.log(error)
      }
      console.log(error.config)
      console.groupEnd()
    } else {
      console.log(`Request Error: ${JSON.stringify(error)}`)
    }
  },
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
