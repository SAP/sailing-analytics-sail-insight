import { __, compose, concat, defaultTo, isNil, path, reduce, unless } from 'ramda'

import {
  Component,
  fold,
  nothing,
  recomposeLifecycle as lifecycle,
} from 'components/fp/component'
import { image, text, view } from 'components/fp/react-native'

import Images from '@assets/Images'

const withCurrentLocation = lifecycle({
  state: { currentLocation: undefined },
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((location: any) =>
      this.setState({ currentLocation: location }),
    )
  },
})

const convertDMS = (coords: number, longitude: boolean) => {
  const cardinalDirection = longitude ? (coords > 0 ? 'E' : 'W') : (coords > 0 ? 'N' : 'S')
  const absolute = Math.abs(coords)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60)

  return {
    cardinalDirection,
    degrees,
    minutes,
    seconds,
  }
}

const coordinateToString = (coords: number, longitude: boolean) => {
  const { cardinalDirection, degrees, minutes, seconds } = convertDMS(coords, longitude)
  return `${cardinalDirection} ${degrees}° ${minutes}' ${seconds}''`
}

const coordinatesToString = ({ latitude, longitude }: any) => {
  const lonString = coordinateToString(longitude, true)
  const latString = coordinateToString(latitude, false)

  return `${latString}/ ${lonString}`
}

const location = Component((props: any) => compose(
  fold(props),
  view({ style: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FE',
  }}),
  reduce(concat, nothing()),
)([
  image({ source: Images.info.location }),
  text(
    {},
    compose(
      defaultTo('loading'),
      unless(isNil, coordinatesToString),
      path(['currentLocation', 'coords']))(props),
  ),
]))

export default Component((props: object) =>
  compose(
    fold(props),
    withCurrentLocation,
  )(location),
)
