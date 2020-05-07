import { RootState } from 'reducers/config'
import { compose, find,
  prop, defaultTo, propEq, map } from 'ramda'

export const getServerState = (state: RootState = {}) =>
  state.communications && state.communications.state

export const getServerIP = () => (state: RootState = {}) =>
  state.communications && state.communications.ip

export const getServerPort = () => (state: RootState = {}) =>
  state.communications && state.communications.port

export const getServerProtocol = (state: RootState = {}) =>
  state.communications && state.communications.protocol

export const getServerValid = (state: RootState = {}) =>
  state.communications && state.communications.valid

export const getStartLine = () => (state: RootState = {}) =>
  state.communications && state.communications.startLine

export const getStartLinePollingStatus = () => (state: RootState = {}) =>
  state.communications && state.communications.startLinePolling

export const getStartLineCourse = () => (state: RootState = {}) =>
  state.communications && state.communications.startLineCourse

export const getMarkPositionsForCourse = (course: any, mark: string) => {

  const getMarkPositions = compose(
    map((markConfiguration: any) => markConfiguration.lastKnownPosition),
    defaultTo({}),
    map(id => find(propEq('id', id))(course.markConfigurations)),
    defaultTo({}),
    prop('markConfigurationIds'),
    defaultTo({}),
    find(propEq('controlPointName', mark)),
    defaultTo({})
  )

  return getMarkPositions(course.waypoints)
}

export const getExpeditionMessages = (state: RootState = {}) =>
    state.communications && state.communications.expeditionMessages
