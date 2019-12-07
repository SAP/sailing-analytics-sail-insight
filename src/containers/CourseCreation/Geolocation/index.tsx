import { __, compose, concat, head, mergeLeft, toString, not,
  objOf, reduce, merge, isEmpty, path, unless, prop, when, always, isNil, has } from 'ramda'

import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
  recomposeWithState as withState
} from 'components/fp/component'
import { view } from 'components/fp/react-native'
import TextInput from 'components/TextInput'

import { MarkPositionType } from 'models/Course'

import styles from './styles'

const withRegion = withState('region', 'setRegion', null)

const marker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    coordinate: props.input.value,
  })))(
  fromClass(Marker)))

const mapView = (settings: any = {}) => Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    fromClass(MapView).contramap,
    merge,
    merge({
      ...settings,
      onPress: compose(
        props.input.onChange,
        merge({ positionType: MarkPositionType.Geolocation }),
        path(['nativeEvent', 'coordinate'])),
      region: compose(
        unless(has('latitudeDelta'), merge({ latitudeDelta: 0.005, longitudeDelta: 0.005 })),
        when(isEmpty, always(settings.currentPosition)),
        when(isNil, always(props.input.value)))(
        props.region),
      onRegionChange: props.setRegion
    }),
    objOf('children'),
    head,
    fold(props))(
    isEmpty(props.input.value) ? nothing() : marker))

const coordinatesInput = ({ propName }: any) => Component((props: any) => compose(
    fold(props),
    contramap(merge({
      value: unless(isEmpty, compose(toString, prop(propName)))(props.input.value),
      onChangeText: (value: any) => props.input.onChange({
        ...props.input.value,
        [propName]: parseFloat(value),
        positionType: MarkPositionType.Geolocation
      }),
      placeholder: propName,
    })))(
    fromClass(TextInput)))

const latitudeInput = coordinatesInput({ propName: 'latitude' })
const longitudeInput = coordinatesInput({ propName: 'longitude' })

export default Component((props: object) =>
  compose(
    fold(props),
    withRegion,
    reduce(concat, nothing()))([
    mapView({
      currentPosition: props.currentPosition,
      style: styles.map,
    }),
    latitudeInput,
    longitudeInput ]))
