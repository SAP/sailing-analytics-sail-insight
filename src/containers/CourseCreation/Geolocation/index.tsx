import { __, compose, concat, head, mergeLeft, toString, not,
  objOf, reduce, merge, isEmpty, path, unless, prop, when,
  always, isNil, has, defaultTo, tap, equals } from 'ramda'

import MapView from 'react-native-maps'

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
import Images from '@assets/Images'
import IconText from 'components/IconText'
import styles from './styles'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const markerIcon = icon({ source: Images.courseConfig.mapMarker, iconStyle: { width: 38, height: 53, marginBottom: 53 } })

const markPositionToMapPosition = position => position && ({
  longitude: position.longitude_deg,
  latitude: position.latitude_deg
})

const defaultProps = (props) => ({
  ...props,
  region: compose(
    unless(has('latitudeDelta'), merge({ latitudeDelta: 0.002, longitudeDelta: 0.002 })),
    when(isEmpty, always(props.currentPosition)),
    when(isNil, always(defaultTo({}, markPositionToMapPosition(props.markPosition)))))(
    props.region)
})

const withRegion = withState('region', 'setRegion', prop('region'))
const withInitialRender = withState('initialRender', 'setInitialRender', true)

const centeredMarker = Component(props => compose(
  fold(props),
  view({ style: styles.markerContainer }))(
  markerIcon))

const Map = Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    concat(__, centeredMarker))(
    fromClass(MapView).contramap(always({
      ...(props.initialRender && { region: props.region }),
      style: styles.map,
      onRegionChange: region => {
        props.setInitialRender(false)
        props.setRegion(region)
      }
    }))))

const coordinatesInput = ({ propName }: any) => Component((props: any) => compose(
    fold(props),
    contramap(merge({
      style: styles.coordinatesInput,
      value: unless(isEmpty, compose(toString, prop(propName)))(props.region),
      placeholder: propName,
    })))(
    fromClass(TextInput)))

const latitudeInput = coordinatesInput({ propName: 'latitude' })
const longitudeInput = coordinatesInput({ propName: 'longitude' })

export default Component((props: object) =>
  compose(
    fold(defaultProps(props)),
    connect(null, { updateMarkConfigurationLocation }),
    withRegion,
    withInitialRender,
    reduce(concat, nothing()))([
    Map,
    latitudeInput,
    longitudeInput]))
