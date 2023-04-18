import { debounce } from 'lodash'
import { __, compose, concat, reduce, mergeRight, ifElse, values,
  isEmpty, unless, prop, when, always, isNil, has, mergeLeft, propEq,
  defaultTo, pick, head, tap, of, flatten, init, nth, map, last, negate,
  equals, reject, all, not } from 'ramda'

import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothingAsClass,
  nothing,
  reduxConnect as connect,
  recomposeWithState as withState,
  recomposeBranch as branch,
  recomposeWithHandlers as withHandlers,
} from 'components/fp/component'

import { getMarkPositionsExceptCurrent } from 'selectors/course'
import { updateMarkConfigurationLocation, updateMarkPosition } from 'actions/courses'
import { view, text } from 'components/fp/react-native'
import TextInputDeprecated from 'components/TextInputDeprecated'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import styles from './styles'
import { Switch, Platform, Alert } from 'react-native'
import { NavigationEvents } from '@react-navigation/compat'
import { dd2ddm, ddm2dd } from 'helpers/utils'
import { $Orange, $primaryBackgroundColor, $secondaryBackgroundColor } from 'styles/colors'
import { HeaderSaveTextButton, HeaderCancelTextButton } from 'components/HeaderTextButton'
import I18n from 'i18n'

const hasNoPadding = propEq('mapOffset', 0)
const nothingWhenNoPadding = branch(hasNoPadding, nothingAsClass)

const trimCoordinates = (coordinate: any) =>
  coordinate.toFixed(7)

const withNavigationHandlers = withHandlers({
  onNavigationCancelPress: (props: any) => () => {

    // truncate to 7 significant digits
    // same coordinates may differ after region is set resulting in incorrect alert shown
    const coordinatesChanged = compose(
      not,
      equals(compose(map(trimCoordinates), reject(isNil), pick(['latitude', 'longitude']), defaultTo({}))(props.region)),
      map(trimCoordinates),
      reject(isNil),
      markPositionToMapPosition,
      pick(['latitude_deg', 'longitude_deg']),
      defaultTo({})
      )(props.markPosition)

    if (coordinatesChanged) {
      Alert.alert(I18n.t('caption_leave'), '',
      [ { text: I18n.t('button_yes'), onPress: () => props.navigation.goBack() },
      { text: I18n.t('button_no'), onPress: () => {} }])
    } else {
      props.navigation.goBack()
    }
  },
  onNavigationSavePress: (props: any) => () => {
    const location = pick(['latitude', 'longitude'], props.region)
    const markConfigurationId = props.selectedMarkConfiguration

    props.updateMarkConfigurationLocation({
      id: markConfigurationId,
      value: location
    })
    props.updateMarkPosition({ markConfigurationId, location })
    props.navigation.goBack()
  }
})

// get height of coordinates input
// use calculated height (half input height + half marker icon height + bottom spacing) to offset marker icon on map so that it looks centered
// in the remaining space
// use calculated height to add map padding to show marker on right coordinates
const onCoordinatesLayout = (props: any, { nativeEvent }: any = {}) => {
  if (
    !nativeEvent ||
    !nativeEvent.layout ||
    !nativeEvent.layout.height === undefined ||
    nativeEvent.layout.x === undefined
  ) {
    return
  }
  const heightInput = nativeEvent.layout.height + nativeEvent.layout.x
  const offset = heightInput / 2 + 53 + 26.5
  props.setMapOffset(offset)
}

const icon = compose(
  fromClass(IconText).contramap,
  always)

const mapStateToProps = (state) => ({
    otherMarksPositions: getMarkPositionsExceptCurrent(state),
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
    unless(has('latitudeDelta'), mergeRight({ latitudeDelta: 0.005, longitudeDelta: 0.005 })),
    when(isEmpty, always(props.currentPosition)),
    when(isNil, always(compose(
      defaultTo({}),
      when(compose(all(isNil), values), always(props.currentPosition)),
      markPositionToMapPosition)(props.markPosition))))(
    props.region)
})

const withRegion = withState('region', 'setRegion', prop('region'))
const withInitialRender = withState('initialRender', 'setInitialRender', true)
const withMapOffset = withState('mapOffset', 'setMapOffset', 0)

const centeredMarker = Component(props => compose(
  fold(props),
  view({ style: [styles.markerContainer, { paddingTop: props.mapOffset }] }))(
  markerIcon))

const Map = Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    concat(__, centeredMarker))(
    fromClass(MapView).contramap(always({
      ...(props.initialRender && { region: props.region }),
      style: styles.map,
      mapPadding: {top: props.mapOffset, right: 0, bottom: 0, left: 0},
      mapType: 'satellite',
      children: map(marker.fold, props.otherMarksPositions),
      onRegionChange: region => {
        props.setInitialRender(false)
        props.setRegion(region)
      }
    }))))

const navigationBackHandler = Component((props: any) => compose(
  fold(props),
  contramap(mergeRight({
    onDidFocus: (payload: any) => {
      props.navigation.setOptions({
        headerRight: HeaderSaveTextButton({
          onPress: debounce(() => {
            props.onNavigationSavePress()
          }, 500, { leading: true, trailing: false })
        }),
        headerLeft: HeaderCancelTextButton({
          onPress: () => {
            props.onNavigationCancelPress()
          }
        }),
        headerLeftContainerStyle: {
          flex: 0.15,
        },
        headerRightContainerStyle: {
          flex: 0.15
        },
        headerTitleContainerStyle: {
          flex: 0.7,
        }
      })
    }
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
    keyboardType: props.decimal ? 'decimal-pad' : 'number-pad',
    returnKeyType: 'done',
    selectionColor: 'white'
  })))(
  fromClass(TextInputDeprecated)))

const switchSelector = Component(props => compose(
  fold(props),
  view({ style: styles.switchSelectorContainer }),
  reduce(concat, nothing()))([
  text({ style: styles.switchSelectorText }, props.switchLabels[0]),
  fromClass(Switch).contramap(mergeRight({
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
      textInput.contramap(mergeRight({
        decimal: false,
        value: defaultTo('', props.degrees),
        inputStyle: { width: 70 },
        onBlur: value => {
          const direction = props.coordinatesDirection === 'N' || props.coordinatesDirection === 'E' ? 1 : -1

          props.setInitialRender(true)
          props.setRegion(mergeRight(props.region, { [props.unit]: ddm2dd([[value || 0, props.minutes, direction]])[0] }))
        },
        maxLength: 3 })),
      text({ style: styles.symbolText }, '°'),
      textInput.contramap(mergeRight({
        decimal: true,
        value: defaultTo('', props.minutes),
        inputStyle: { width: 115 },
        onBlur: value => {
          const direction = props.coordinatesDirection === 'N' || props.coordinatesDirection === 'E' ? 1 : -1

          props.setInitialRender(true)
          props.setRegion(mergeRight(props.region, { [props.unit]: ddm2dd([[props.degrees, value || 0, direction]])[0] }))
        },
        maxLength: 6 })),
      text({ style: styles.symbolText }, "'"),
      switchSelector.contramap(mergeRight({
        onValueChange: value => {
          props.setInitialRender(true)
          props.setRegion(mergeRight(props.region, {
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

const latitudeInput = coordinatesInput.contramap(props => mergeRight({
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
const longitudeInput = coordinatesInput.contramap(props => mergeRight({
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

const coordinatesContainer = Component((props: any) => compose(
    fold(props),
    view({ style: styles.coordinatesModalContainer, onLayout: (nativeEvent: any) => onCoordinatesLayout(props, nativeEvent) }),
    reduce(concat, nothing()))([
      latitudeInput,
      longitudeInput
    ]))

export default Component((props: object) =>
  compose(
    fold(defaultProps(props)),
    connect(mapStateToProps, { updateMarkConfigurationLocation, updateMarkPosition }),
    withInitialRender,
    withRegion,
    withMapOffset,
    withNavigationHandlers,
    concat(navigationBackHandler),
    concat(nothingWhenNoPadding(Map)),
    )(coordinatesContainer))
