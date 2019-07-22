import { __, compose, concat, map, merge, mergeLeft, head, reduce, range, objOf } from 'ramda'

import React from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  fold,
  fromClass,
  nothing,
  contramap,
  recomposeWithState as withState
} from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import TextInput from 'components/TextInput'

import styles from './styles'

const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 1,
  longitudeDelta: 1,
}
const withRegion = withState('region', 'setRegion', initialRegion)

const marker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    coordinate: props.region,
  })),
)(fromClass(Marker)))

const mapView = (settings: any) => Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    fromClass(MapView).contramap,
    mergeLeft,
    mergeLeft({
      onRegionChange: (region: any) => {
        props.setRegion(region)
      }
    }),
    mergeLeft(settings),
    objOf('children'),
    head,
    fold(props),
  )(marker)
)

const COORDS_PRECISION = 7
const coordinatesInput = ({ propName }: any) => Component((props: any) => compose(
    fold(props),
    contramap(mergeLeft({
      // value: props.region[propName].toPrecision(COORDS_PRECISION).toString(),
      value: props.region[propName].toString(),
      onChangeText: (value: any) => props.setRegion({
        ...props.region,
        [propName]: value,
      }),
      placeholder: propName,
    }))
  )(fromClass(TextInput))
)

const latitudeInput = coordinatesInput({ propName: 'latitude' })
const longitudeInput = coordinatesInput({ propName: 'longitude' })

export default Component((props: object) =>
  compose(
    fold(props),
    withRegion,
    reduce(concat, nothing()),
  )([
    mapView({
      style:styles.map,
    }),
    latitudeInput,
    longitudeInput
  ])
)
