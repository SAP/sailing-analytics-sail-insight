import { RootState } from 'reducers/config'
import { compose, find, 
  prop, defaultTo, propEq, map} from 'ramda'

export const getServerState = (state: RootState = {}) =>
  state.communications && state.communications.state

export const getServerIP = (state: RootState = {}) =>
  state.communications && state.communications.ip

export const getServerPort = (state: RootState = {}) =>
  state.communications && state.communications.port

export const getServerProtocol = (state: RootState = {}) =>
  state.communications && state.communications.protocol

export const getServerValid = (state: RootState = {}) => 
  state.communications && state.communications.valid

export const getMarkPositionsForCourse = (course: any, mark: string) => {

  const getMarkPositions = compose(
    map((markConfiguration: any) => markConfiguration.lastKnownPosition),
    defaultTo({}),
    map(id => find(propEq('id', id))(course.markConfigurations)),
    prop('markConfigurationIds'),
    defaultTo({}),
    find(propEq('controlPointName', mark)),
    defaultTo({})
  )

  return getMarkPositions(course.waypoints)
  
}