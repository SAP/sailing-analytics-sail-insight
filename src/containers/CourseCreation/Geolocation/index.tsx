import { __, compose, concat, toString, reduce, merge,
  isEmpty, unless, prop, when, always, isNil, has, mergeLeft,
  defaultTo, pick, head, tap, of, flatten, init, nth, map } from 'ramda'

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

import { getMarkPositionsExceptCurrent } from 'selectors/course'
import { updateMarkConfigurationLocation } from 'actions/courses'
import { view, text, keyboardAvoidingView } from 'components/fp/react-native'
import TextInput from 'components/TextInput'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import styles from './styles'
import { Switch } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { dd2ddm } from 'helpers/utils'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const mapStateToProps = (state) => ({
  otherMarksPositions: getMarkPositionsExceptCurrent(state)
})

const markerIcon = icon({ source: Images.courseConfig.mapMarker, iconStyle: { width: 38, height: 53, marginBottom: 53 } })

const markPositionToMapPosition = position => position && ({
  longitude: position.longitude_deg,
  latitude: position.latitude_deg
})

const marker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    coordinate: markPositionToMapPosition(props),
    image: Images.courseConfig.mapMarkerSmall
  })))(
  fromClass(Marker)))

const defaultProps = (props) => ({
  ...props,
  region: compose(
    unless(has('latitudeDelta'), merge({ latitudeDelta: 0.002, longitudeDelta: 0.002 })),
    when(isEmpty, always(props.currentPosition)),
    when(isNil, always(defaultTo({}, markPositionToMapPosition(props.markPosition)))))(
    props.region)
})

const withRegion = withState('region', 'setRegion', prop('region'))

const centeredMarker = Component(props => compose(
  fold(props),
  view({ style: styles.markerContainer }))(
  markerIcon))

const Map = Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    concat(__, centeredMarker))(
    fromClass(MapView).contramap(always({
      initialRegion: props.region,
      style: styles.map,
      mapType: 'satellite',
      children: map(marker.fold, props.otherMarksPositions),
      onRegionChange: region => props.setRegion(region)
    }))))

const navigationBackHandler = Component(props => compose(
  fold(props),
  contramap(merge({
    onWillBlur: payload => !payload.state && props.updateMarkConfigurationLocation({
      id: props.selectedMarkConfiguration,
      value: pick(['latitude', 'longitude'], props.region)
    })
  })),
  fromClass)(
  NavigationEvents))

const textInput = Component(props => compose(
  fold(props),
  contramap(merge({
    inputStyle: [styles.coordinatesInput, props.cinputStyle],
    style: styles.inputMainContainer,
    containerStyle: styles.inputContainer,
    inputContainerStyle: styles.inputContainer,
    value: props.value,
    keyboardType: 'number-pad'
  })))(
  fromClass(TextInput)))

const switchSelector = Component(props => compose(
  fold(props),
  view({ style: styles.switchSelectorContainer }),
  reduce(concat, nothing()))([
  text({ style: styles.switchSelectorText }, props.switchLabels[0]),
  fromClass(Switch),
  text({ style: styles.switchSelectorText }, props.switchLabels[1])]))

const coordinatesInput = Component((props: any) => compose(
    fold(props),
    view({ style: styles.coordinatesContainer }),
    concat(text({ style: styles.coordinatesTitle }, props.title)),
    view({ style: styles.coordinatesControlContainer }),
    reduce(concat, nothing()))([
      textInput.contramap(merge({
        value: compose(init, head, flatten, dd2ddm, of, prop(props.unit))(props.region),
        cinputStyle: { width: 70 },
        maxLength: 3 })),
      text({ style: styles.symbolText }, '°'),
      textInput.contramap(merge({
        value: compose(init, nth(1), flatten, dd2ddm, of, prop(props.unit))(props.region),
        cinputStyle: { width: 100 },
        maxLength: 6 })),
      text({ style: styles.symbolText }, "'"),
      switchSelector
    ]))

const latitudeInput = coordinatesInput.contramap(merge({ unit: 'latitude', title: 'Latitude', switchLabels: ['N', 'S'] }))
const longitudeInput = coordinatesInput.contramap(merge({ unit: 'longitude', title: 'Longitude', switchLabels: ['W', 'E'] }))

export default Component((props: object) =>
  compose(
    fold(defaultProps(props)),
    connect(mapStateToProps, { updateMarkConfigurationLocation }),
    withRegion,
    concat(navigationBackHandler),
    concat(Map),
    keyboardAvoidingView({ style: styles.coordinatesModalContainer, behavior: undefined }),
    reduce(concat, nothing()))([
    latitudeInput,
    longitudeInput]))
