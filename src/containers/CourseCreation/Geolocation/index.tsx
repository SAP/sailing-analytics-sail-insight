import { __, compose, concat, head, mergeLeft, toString, not,
  objOf, reduce, merge, isEmpty, path, unless, prop, when,
  always, isNil, has, defaultTo, tap } from 'ramda'

import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
  reduxConnect as connect,
  recomposeWithState as withState
} from 'components/fp/component'

import { updateMarkConfigurationLocation } from 'actions/courses'
import { view } from 'components/fp/react-native'
import TextInput from 'components/TextInput'

import styles from './styles'

const withMarkPosition = withState('markPosition', 'setMarkPosition', prop('markPosition'))

const marker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    coordinate: markPositionToMapPosition(props.markPosition)
  })))(
  fromClass(Marker)))

const markPositionToMapPosition = position => position && ({
  longitude: position.longitude_deg,
  latitude: position.latitude_deg
})

const Map = Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    fromClass(MapView).contramap,
    merge,
    merge({
      style: styles.map,
      onPress: compose(
        value => {
          props.updateMarkConfigurationLocation({
            id: props.selectedMarkConfiguration,
            value
          })
          props.setMarkPosition({ latitude_deg: value.latitude, longitude_deg: value.longitude })
        },
        path(['nativeEvent', 'coordinate'])),
      region: compose(
        unless(has('latitudeDelta'), merge({ latitudeDelta: 0.002, longitudeDelta: 0.002 })),
        when(isEmpty, always(props.currentPosition)),
        when(isNil, always(defaultTo({}, markPositionToMapPosition(props.markPosition)))))(
        props.region),
    }),
    objOf('children'),
    head,
    fold(props))(
    isNil(props.markPosition) ? nothing() : marker))

// const coordinatesInput = ({ propName }: any) => Component((props: any) => compose(
//     fold(props),
//     contramap(merge({
//       value: unless(isEmpty, compose(toString, prop(propName)))(props.markPosition),
//       onChangeText: (value: any) => props.input.onChange({
//         ...props.input.value,
//         [propName]: parseFloat(value),
//         positionType: MarkPositionType.Geolocation
//       }),
//       placeholder: propName,
//     })))(
//     fromClass(TextInput)))

// const latitudeInput = coordinatesInput({ propName: 'latitude' })
// const longitudeInput = coordinatesInput({ propName: 'longitude' })

export default Component((props: object) =>
  compose(
    fold(props),
    withMarkPosition,
    connect(null, { updateMarkConfigurationLocation }),
    reduce(concat, nothing()))([
    Map]))
