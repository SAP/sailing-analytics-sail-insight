import { __, compose, concat, reduce, merge, ifElse, values,
  isEmpty, unless, prop, when, always, isNil, has, mergeLeft, propEq,
  defaultTo, pick, head, tap, of, flatten, init, nth, map, last, negate,
  equals, reject, all } from 'ramda'

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
import { view, text } from 'components/fp/react-native'
import TextInput from 'components/TextInput'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import styles from './styles'
import { Switch, Platform } from 'react-native'
import { NavigationEvents } from '@react-navigation/compat'
import { dd2ddm, ddm2dd } from 'helpers/utils'
import { $Orange, $primaryBackgroundColor, $secondaryBackgroundColor } from 'styles/colors'

const icon = compose(
  fromClass(IconText).contramap,
  always)

const mapStateToProps = (state) => ({
  otherMarksPositions: getMarkPositionsExceptCurrent(state)
})

const markerIcon = icon({
  source: Images.courseConfig.mapMarker,
  iconStyle: { width: 38, height: 53, marginBottom: 53, tintColor: $Orange } })

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
    unless(has('latitudeDelta'), merge({ latitudeDelta: 0.005, longitudeDelta: 0.005 })),
    when(isEmpty, always(props.currentPosition)),
    when(isNil, always(compose(
      defaultTo({}),
      when(compose(all(isNil), values), always(props.currentPosition)),
      markPositionToMapPosition)(props.markPosition))))(
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
      mapType: 'satellite',
      children: map(marker.fold, props.otherMarksPositions),
      onRegionChange: region => {
        props.setInitialRender(false)
        props.setRegion(region)
      }
    }))))

const navigationBackHandler = Component((props: any) => compose(
  fold(props),
  contramap(merge({
    onWillBlur: (payload: any) => !payload.state && props.updateMarkConfigurationLocation({
      id: props.selectedMarkConfiguration,
      value: pick(['latitude', 'longitude'], props.region)
    })
  })),
  fromClass)(
  NavigationEvents))

const textInput = Component(props => compose(
  fold(props),
  contramap(mergeLeft({
    inputStyle: [styles.coordinatesInput, props.inputStyle],
    style: styles.inputMainContainer,
    containerStyle: styles.inputContainer,
    inputContainerStyle: styles.inputContainer,
    value: props.value,
    keyboardType: 'number-pad',
    returnKeyType: 'done'
  })))(
  fromClass(TextInput)))

const switchSelector = Component(props => compose(
  fold(props),
  view({ style: styles.switchSelectorContainer }),
  reduce(concat, nothing()))([
  text({ style: styles.switchSelectorText }, props.switchLabels[0]),
  fromClass(Switch).contramap(merge({
    value: props.switchLabels[1] === props.coordinatesDirection,
    ...(Platform.OS === 'android' ? {
      trackColor: { false: 'gray', true: 'gray' },
      thumbColor: 'white',
    } : {
      trackColor: { true: $primaryBackgroundColor, false: $secondaryBackgroundColor },
      tintColor: $primaryBackgroundColor,
    })
  })),
  text({ style: styles.switchSelectorText }, props.switchLabels[1])]))

const coordinatesInput = Component((props: any) => compose(
    fold(props),
    view({ style: styles.coordinatesContainer }),
    concat(text({ style: styles.coordinatesTitle }, props.title)),
    view({ style: styles.coordinatesControlContainer }),
    reduce(concat, nothing()))([
      textInput.contramap(merge({
        value: defaultTo('', props.degrees),
        inputStyle: { width: 70 },
        onBlur: value => {
          const direction = props.coordinatesDirection === 'N' || props.coordinatesDirection === 'E' ? 1 : -1

          props.setInitialRender(true)
          props.setRegion(merge(props.region, { [props.unit]: ddm2dd([[value || 0, props.minutes, direction]])[0] }))
        },
        maxLength: 3 })),
      text({ style: styles.symbolText }, '°'),
      textInput.contramap(merge({
        value: defaultTo('', props.minutes),
        inputStyle: { width: 115 },
        onBlur: value => {
          const direction = props.coordinatesDirection === 'N' || props.coordinatesDirection === 'E' ? 1 : -1

          props.setInitialRender(true)
          props.setRegion(merge(props.region, { [props.unit]: ddm2dd([[props.degrees, value || 0, direction]])[0] }))
        },
        maxLength: 6 })),
      text({ style: styles.symbolText }, "'"),
      switchSelector.contramap(merge({
        onValueChange: value => {
          props.setInitialRender(true)
          props.setRegion(merge(props.region, {
            [props.unit]: ddm2dd([[
              props.degrees,
              props.minutes,
              compose(
                when(always(propEq('unit', 'longitude', props)), negate),
                ifElse(equals(true), always(-1), always(1)))(
                value)
            ]])[0] }))
          }
      }))
    ]))

const latitudeInput = coordinatesInput.contramap(props => merge({
  title: 'Latitude',
  unit: 'latitude',
  degrees: compose(reduce(concat, ''), init, defaultTo(''), head, flatten, dd2ddm, reject(isNil), of, prop('latitude'))(props.region),
  minutes: compose(reduce(concat, ''), init, defaultTo(''), nth(1), flatten, dd2ddm, reject(isNil), of, prop('latitude'))(props.region),
  coordinatesDirection: compose(
    last,
    defaultTo(['N']),
    flatten,
    head,
    dd2ddm,
    reject(isNil),
    values,
    pick(['latitude', 'longitude']))(props.region),
  switchLabels: ['N', 'S'] }, props))
const longitudeInput = coordinatesInput.contramap(props => merge({
  unit: 'longitude',
  title: 'Longitude',
  degrees: compose(reduce(concat, ''), init, defaultTo(''), head, flatten, dd2ddm, reject(isNil), of, prop('longitude'))(props.region),
  minutes: compose(reduce(concat, ''), init, defaultTo(''), nth(1), flatten, dd2ddm, reject(isNil), of, prop('longitude'))(props.region),
  coordinatesDirection: compose(
    last,
    defaultTo(['E']),
    flatten,
    last,
    dd2ddm,
    reject(isNil),
    values,
    pick(['latitude', 'longitude']))(props.region),
  switchLabels: ['W', 'E'] }, props))

export default Component((props: object) =>
  compose(
    fold(defaultProps(props)),
    connect(mapStateToProps, { updateMarkConfigurationLocation }),
    withInitialRender,
    withRegion,
    concat(navigationBackHandler),
    concat(Map),
    view({ style: styles.coordinatesModalContainer }),
    reduce(concat, nothing()))([
    latitudeInput,
    longitudeInput]))
