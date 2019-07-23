import { __, compose, concat, map, merge, mergeLeft, head, reduce, range, objOf, path } from 'ramda'

import React from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  fold,
  fromClass,
  nothing,
  contramap,
  recomposeLifecycle as lifecycle,
} from 'components/fp/component'
import { text, image, view } from 'components/fp/react-native'

import Images from '@assets/Images'

const withCurrentLocation = lifecycle({
  state: { currentLocation: undefined },
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((location: any) =>
      this.setState({ currentLocation: location })
    )
  }
})

const convertDMS = (coords: number, longitude: boolean) => {
  const cardinalDirection = longitude ? (coords > 0 ? "E" : "W") : (coords > 0 ? "N" : "S")
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
  text({}, path(['currentLocation', 'coords'], props) ?
    coordinatesToString(path(['currentLocation', 'coords'], props)) : 'loading')
]))

export default Component((props: object) =>
  compose(
    fold(props),
    withCurrentLocation,
  )(location)
)
