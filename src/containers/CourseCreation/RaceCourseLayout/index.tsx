import { __, compose, always, both, path, when, move, length,
  prop, map, reduce, concat, merge, defaultTo, any, take, props as rProps,
  objOf, isNil, not, equals, pick, tap, ifElse, insert, complement, uncurryN,
  propEq, addIndex, intersperse, gt, findIndex, unless, tail, has } from 'ramda'
import {
  Component, fold, fromClass, nothing, nothingAsClass, contramap,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState,
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity, forwardingPropsFlatList } from 'components/fp/react-native'
import { Switch, Alert } from 'react-native'
import uuidv4 from 'uuid/v4'

import { MarkPositionType, PassingInstruction } from 'models/Course'

import { selectWaypoint, removeWaypoint, addWaypoint, toggleSameStartFinish,
  selectMarkConfiguration, updateWaypointName, updateWaypointShortName,
  updateMarkConfigurationName, updateMarkConfigurationShortName, saveCourse,
  updateWaypointPassingInstruction, changeWaypointToNewMark, changeWaypointToNewLine,
  updateMarkConfigurationLocation, assignMarkPropertiesToMarkConfiguration,
  replaceWaypointMarkConfiguration, changeWaypointMarkConfigurationToNew } from 'actions/courses'
import { getSelectedWaypoint, waypointLabel, getMarkPropertiesByMarkConfiguration,
  getSameStartFinish, getEditedCourse, getCourseLoading,
  getSelectedMarkConfiguration, getSelectedMarkProperties,
  getSelectedMarkPosition } from 'selectors/course'

import { getMarkPropertiesAndMarksOptionsForCourse } from 'selectors/inventory'

import { navigateToCourseGeolocation, navigateToCourseTrackerBinding } from 'navigation'
import { coordinatesToString } from 'helpers/utils'

import TextInput from 'components/TextInput'
import SwitchSelector from 'react-native-switch-selector'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import Dash from 'react-native-dash'
import { NavigationEvents } from 'react-navigation'
import Snackbar from 'react-native-snackbar'

import EStyleSheets from 'react-native-extended-stylesheet'
import styles from './styles'

import { $MediumBlue, $Orange, $DarkBlue, $LightDarkBlue } from 'styles/colors'

const mapIndexed = addIndex(map)

const mapStateToProps = (state: any) => {
    let props = {
      loading: getCourseLoading(state)
    }

    if (!props.loading) {
      props = {
        course: getEditedCourse(state),
        selectedWaypoint: getSelectedWaypoint(state),
        selectedMarkConfiguration: getSelectedMarkConfiguration(state),
        selectedMarkProperties: getSelectedMarkProperties(state),
        selectedMarkLocation: getSelectedMarkPosition(state),
        waypointLabel: uncurryN(2, waypointLabel)(__, state),
        markPropertiesByMarkConfiguration: uncurryN(2, getMarkPropertiesByMarkConfiguration)(__, state),
        sameStartFinish: getSameStartFinish(state),
        marksAndMarkPropertiesOptions: getMarkPropertiesAndMarksOptionsForCourse(state)
    }
  }

  return props
}

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const isGateWaypoint = compose(equals(2), length, defaultTo([]), path(['selectedWaypoint', 'markConfigurationIds']))
const isEmptyWaypoint = compose(isNil, path(['selectedWaypoint', 'markConfigurationIds']))
const isWaypointSelected = (waypoint: any, props: any) => props.selectedWaypoint && props.selectedWaypoint.id === waypoint.id
const isStartOrFinishGate = both(isGateWaypoint,
  props => compose(
    any(compose(equals(props.selectedWaypoint.id), prop('id'))),
    take(2),
    move(-1, 0))(
    props.course.waypoints))

const nothingWhenLoading = branch(isLoading, nothingAsClass)
const nothingWhenNotLoading = branch(isNotLoading, nothingAsClass)
const nothingWhenNoSelectedWaypoint = branch(compose(isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenSelectedWaypoint = branch(compose(not, isNil, prop('selectedWaypoint')), nothingAsClass)
const nothingWhenGate = branch(isGateWaypoint, nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingWhenEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingWhenNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)
const nothingWhenNotSelected = branch(compose(isNil, prop('selected')), nothingAsClass)
const nothingWhenNoMarkLocation = branch(compose(isNil, prop('selectedMarkLocation')), nothingAsClass)
const nothingWhenNotEditingGateName = branch(compose(equals(false), prop('editingGateName')), nothingAsClass)
const nothingWhenNotEditingMarkName = branch(compose(equals(false), prop('editingMarkName')), nothingAsClass)
const nothingWhenNoShowMarkProperties = branch(compose(equals(false), prop('showMarkProperties')), nothingAsClass)
const nothingWhenShowMarkProperties = branch(compose(equals(true), prop('showMarkProperties')), nothingAsClass)

const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', MarkPositionType.TrackingDevice)
const withEditingMarkName = withState('editingMarkName', 'setEditingMarkName', false)
const withEditingGateName = withState('editingGateName', 'setEditingGateName', false)
const withShowMarkProperties = withState('showMarkProperties', 'setShowMarkProperties', false)

const icon = compose(
  fromClass(IconText).contramap,
  always)

const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markIcon = icon({ source: Images.courseConfig.markIcon, iconStyle: { width: 80, height: 80 } })
const deleteIcon = icon({ source: Images.courseConfig.deleteIcon, iconStyle: { width: 13, height: 13 } })
const roundingLeftIcon = icon({ source: Images.courseConfig.roundingDirectionLeft })
const roundingRightIcon = icon({ source: Images.courseConfig.roundingDirectionRight })
const gatePassingIcon = icon({ source: Images.courseConfig.gatePassing, iconStyle: { width: 35, height: 35 } })
const linePassingIcon = icon({ source: Images.courseConfig.linePassing, iconStyle: { width: 30, height: 30 } })
const trackerIcon = icon({ source: Images.courseConfig.tracker, iconStyle: { width: 11, height: 11 } })
const nameEditIcon = icon({ source: Images.actions.penEdit, iconStyle: { width: 14, height: 14 } })
const locationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 11, height: 11 } })
const bigLocationIcon = icon({ source: Images.courseConfig.location, iconStyle: { width: 25, height: 25 } })
const chevronArrowDown = icon({ source: Images.actions.arrowDown, iconStyle: { width: 14, height: 14 } })
const chevronArrowUp = icon({ source: Images.actions.arrowUp, iconStyle: { width: 14, height: 14 } })
const arrowUp = ({ color = $LightDarkBlue }: any = {}) => icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: 25 },
  iconStyle: { height: 12, tintColor: color } })

const plusIcon = icon({
  source: Images.actions.add,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center' }
})

const dashLine = fromClass(Dash).contramap(always({
  style: { height: 50, width: 90, alignItems: 'center' },
  dashColor: 'white'
}))

const GateMarkSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.gateMarkSelectorItemContainer }),
    concat(__, nothingWhenNotSelected(arrowUp())),
    touchableOpacity({
      style: [ styles.gateMarkSelectorItem, props.selected ? styles.gateMarkSelectorItemSelected : null ],
      onPress: (props: any) => props.selectMarkConfiguration(props.markConfigurationId) }),
    text({ style: styles.gateMarkSelectorText }),
    defaultTo(''),
    prop('shortName'),
    props.markPropertiesByMarkConfiguration)(
    props.markConfigurationId))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
    concat(text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Defining gate marks')),
    view({ style: styles.gateMarkSelectorContainer }),
    reduce(concat, nothing()),
    intersperse(dashLine),
    map(compose(
      GateMarkSelectorItem.contramap,
      merge,
      when(propEq('markConfigurationId', props.selectedMarkConfiguration), merge({ selected: true })),
      objOf('markConfigurationId'))),
    defaultTo([]),
    path(['selectedWaypoint', 'markConfigurationIds']))(
    props))

const SameStartFinish = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.sameStartFinishContainer }),
    reduce(concat, nothing()))([
    fromClass(Switch).contramap(merge({
      value: props.sameStartFinish,
      onValueChange: props.toggleSameStartFinish,
      trackColor: { false: 'gray', true: 'white' },
      thumbColor: 'white'
    })),
    text({ style: styles.sameStartFinishText }, 'Start & finish are the same')
  ]))

const MarkPositionTracking = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(text({ style: styles.trackingText }, 'No device tracked')),
    touchableOpacity({
      onPress: navigateToCourseTrackerBinding
    }))(
    text({ style: styles.trackingText }, 'Change Tracking Device')))

const MarkPositionPing = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    style: styles.pingPositionButton,
    onPress: (props: object) => navigator.geolocation.getCurrentPosition(compose(
      position => props.updateMarkConfigurationLocation({
        id: props.selectedMarkConfiguration,
        value: position
      }),
      pick(['latitude', 'longitude']),
      prop('coords')))
  }))(
  text({ style: [styles.locationText, styles.pingText] }, 'PING POSITION')))

const MarkPositionCoordinates = Component(props => compose(
  fold(props),
  view({ style: styles.coordinatesContainer }),
  concat(bigLocationIcon),
  text({ style: styles.coordinatesText }),
  defaultTo(''),
  unless(isNil, coordinatesToString))(
  props.selectedMarkLocation))

const MarkPositionGeolocation = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(nothingWhenNoMarkLocation(MarkPositionCoordinates)),
    concat(MarkPositionPing),
    touchableOpacity({
      style: styles.editPositionButton,
      onPress: () => navigator.geolocation.getCurrentPosition(({ coords }) =>
        navigateToCourseGeolocation({
          selectedMarkConfiguration: props.selectedMarkConfiguration,
          currentPosition: coords,
          markPosition: props.selectedMarkLocation })) }))(
    text({ style: styles.locationText }, 'Edit Position')))

const locationTypes = [
  { value: MarkPositionType.TrackingDevice, label: 'TRACKER', customIcon: trackerIcon.fold },
  { value: MarkPositionType.Geolocation, label: 'LOCATION', customIcon: locationIcon.fold }]

const PositionSelector = fromClass(SwitchSelector).contramap((props: any) => ({
  options: locationTypes,
  initial: compose(
    when(gt(0), always(0)),
    findIndex(i => i.value === props.selectedPositionType))(
    locationTypes),
  onPress: props.setSelectedPositionType,
  backgroundColor: $MediumBlue,
  selectedColor: 'white',
  buttonColor: $Orange,
  textColor: 'white',
  borderColor: 'white',
  borderRadius: 2,
  hasPadding: true,
  height: 55,
  textStyle: styles.locationSwitchText
}))

const MarkPosition = Component((props: object) =>
  compose(
    fold(props),
    reduce(concat, nothing()))([
      text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Locate or track'),
      PositionSelector,
      arrowUp({color: $DarkBlue }),
      nothingWhenNotTrackingSelected(MarkPositionTracking),
      nothingWhenNotGeolocationSelected(MarkPositionGeolocation)
    ]))

const Appearance = Component((props: object) =>
  compose(
    fold(props))(
    text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, 'Appearance')))

const DeleteButton = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.deleteWaypointContainer }),
    touchableOpacity({ onPress: (props: any) =>
      props.removeWaypoint({
        id: props.selectedWaypoint.id,
        newSelectedId: props.course.waypoints[findIndex(propEq('id', props.selectedWaypoint.id), props.course.waypoints) - 1].id
      })
    }),
    view({ style: styles.deleteWaypointButton }),
    concat(deleteIcon))(
    text({ style: styles.deleteButtonText }, 'Delete this mark from course')))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.createNewContainer }),
    concat(text({ style: styles.createNewTitle }, 'Create new')),
    view({ style: { ...styles.createNewClassContainer, justifyContent: props.insideGate ? 'center' : 'space-between' }}),
    reduce(concat, nothing()),
    when(always(equals(true, props.insideGate)), tail))([
    touchableOpacity({
      onPress: () => props.changeWaypointToNewLine({
        id: props.selectedWaypoint.id,
        markConfigurationIds: [uuidv4(), uuidv4()]
      })
    }, gateIcon),
    touchableOpacity({
      onPress: () => props.insideGate ? props.changeWaypointMarkConfigurationToNew({
        id: props.selectedWaypoint.id,
        oldId: props.selectedMarkConfiguration,
        newId: uuidv4()
      }) : props.changeWaypointToNewMark({
        id: props.selectedWaypoint.id,
        markConfigurationIds: [uuidv4()]
      }),
    }, markIcon)]))

const TextInputWithLabel = Component((props: any) => compose(
  fold(props),
  view({ style: props.isShort ? { flexBasis: 10 } : { flexBasis: 50 }}),
  concat(__, fromClass(TextInput)),
  text({ style: styles.textInputLabel, numberOfLines: 1 }))(
  props.inputLabel))

const gateNameInputData = props => [
  { inputLabel: 'Name',
    value: props.selectedWaypoint.controlPointName,
    onBlur: (value: string) => props.updateWaypointName({
      id: props.selectedWaypoint.id,
      value
    })
  },
  { inputLabel: 'Short Name',
    value: props.selectedWaypoint.controlPointShortName,
    onBlur: (value: string) => props.updateWaypointShortName({
      id: props.selectedWaypoint.id,
      value
    }) } ]

const markNamesInputData = props => [
  { inputLabel: 'Name',
    value: props.selectedMarkProperties.name,
    onBlur: (value: string) => props.updateMarkConfigurationName({
      id: props.selectedMarkConfiguration,
      value
    })
  },
  { inputLabel: 'Short Name',
    value: props.selectedMarkProperties.shortName,
    onBlur: (value: string) => props.updateMarkConfigurationShortName({
      id: props.selectedMarkConfiguration,
      value
    }) }]

const EditButton = Component(props => compose(
  fold(props),
  touchableOpacity({
    onPress: props.onPress || (() => {}),
    style: styles.markNameEditButton}))(
  nameEditIcon))

const MarkPropertiesDropdown = Component(props => compose(
  fold(props),
  view({ style: styles.markNameEditContainer }),
  concat(__, EditButton.contramap(merge({
    onPress: () => props.setEditingMarkName(!props.editingMarkName)
  }))),
  touchableOpacity({
    onPress: () => props.setShowMarkProperties(!props.showMarkProperties),
    style: { flex: 1 }
  }),
  view({ style: styles.markPropertiesDropdownTextContainer }),
  reduce(concat, nothing()))([
  text({ style: styles.markPropertiesDropdownText },
    `(${defaultTo('', props.selectedMarkProperties.shortName)}) ${defaultTo('', props.selectedMarkProperties.name)}`),
  nothingWhenShowMarkProperties(chevronArrowDown),
  nothingWhenNoShowMarkProperties(chevronArrowUp) ]))

const GateNameDropdown = Component(props => compose(
  fold(props),
  touchableOpacity({ style: styles.markNameEditContainer,
    onPress: () => props.setEditingGateName(!props.editingGateName) }),
  view({ style: { flex: 1, flexDirection: 'row' }}),
  concat(__, EditButton.contramap(merge({ onPress: () => props.setEditingGateName(!props.editingGateName) }))),
  view({ style: { ...styles.markPropertiesDropdownTextContainer, flex: 1 } }),
  text({ style: styles.markPropertiesDropdownText }))(
  `(${defaultTo('', props.selectedWaypoint.controlPointShortName)}) ${defaultTo('', props.selectedWaypoint.controlPointName)}`))

const MarksOrMarkPropertiesOptionsListItem = Component((props: object) =>
compose(
  fold(props),
  touchableOpacity({
    onPress: () => {
      let markConfigurationId = props.selectedMarkConfiguration

      // This code needs to be moved in upper layers.
      if (isEmptyWaypoint(props)) {
        markConfigurationId = uuidv4()

        props.changeWaypointToNewMark({
          id: props.selectedWaypoint.id,
          markConfigurationIds: [props.item.markId ? props.item.id : markConfigurationId]
        })
      }

      props.item.markId ?
      props.replaceWaypointMarkConfiguration({
        id: props.selectedWaypoint.id,
        oldId: markConfigurationId,
        newId: props.item.id
      }) :
      props.assignMarkPropertiesToMarkConfiguration({
        id: markConfigurationId,
        markProperties: props.item
      })
    }
  }),
  view({ style: styles.markPropertiesListItem }),
  text({ style: styles.markPropertiesListItemText }),
  reduce(concat, ''),
  intersperse(' '),
  mapIndexed((v, i) => i === 0 ? `(${v})` : v),
  map(defaultTo('')),
  rProps(['shortName', 'name']),
  when(has('effectiveProperties'), prop('effectiveProperties')),
  prop('item'))(
  props))

const MarksOrMarkPropertiesOptionsList = Component((props: object) => compose(
    fold(props),
    scrollView({ style: styles.markPropertiesListContainer, nestedScrollEnabled: true, flexGrow: 0 }))(
    forwardingPropsFlatList.contramap((props: any) =>
      merge({
        data: props.marksAndMarkPropertiesOptions,
        renderItem: MarksOrMarkPropertiesOptionsListItem.fold
      }, props))))

const ShortAndLongName = Component((props: object) =>
  compose(
    fold(props),
    view({ style: {
      ...styles.editNameContainer,
      backgroundColor: isGateWaypoint(props) && !props.isGateEdit ? $DarkBlue : $LightDarkBlue }}),
    reduce(concat, nothing()),
    mapIndexed((data, index) => compose(
      view({ style: index === 1 ? { marginLeft: 30 } : { flex: 1, flexBasis: 1 }}),
      compose(TextInputWithLabel.contramap, merge),
      merge({
        maxLength: index === 1 ? 5 : 100,
        inputStyle: styles.textInput,
        inputContainerStyle: styles.textInputContainer,
        containerStyle: styles.textInputInputContainer }))(data)))(
    props.items))

const PassingInstructionItem = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: (props: any) => props.updateWaypointPassingInstruction({ id: props.selectedWaypoint.id, value: props.type }),
      style: [
        styles.passingInstruction,
        props.selected ? styles.selectedPassingInstruction : '' ]}))(
    props.icon))

const singleMarkPassingInstructions = [
  { type: PassingInstruction.Port, icon: roundingLeftIcon },
  { type: PassingInstruction.Starboard, icon: roundingRightIcon }]

const gatePassingInstructions = [
  { type: PassingInstruction.Gate, icon: gatePassingIcon },
  { type: PassingInstruction.Line, icon: linePassingIcon }]

const PassingInstructions = Component((props: object) =>
  compose(
    fold(props),
    concat(text(
      { style: [styles.sectionTitle, styles.indentedSectionTitle] },
      isGateWaypoint(props) ? 'Passing Gate' : 'Rounding direction')),
    view({ style: styles.passingInstructionContainer }),
    reduce(concat, nothing()),
    map(compose(
      PassingInstructionItem.contramap,
      merge,
      when(propEq('type', props.selectedWaypoint.passingInstruction), merge({ selected: true })))),
    ifElse(isGateWaypoint, always(gatePassingInstructions), always(singleMarkPassingInstructions)))(
    props))

const WaypointEditForm = Component((props: any) =>
  compose(
    fold(props),
    withShowMarkProperties,
    view({ style: [styles.editContainer, !isGateWaypoint(props) && styles.indentedContainer ] }),
    concat(compose(
      view({ style: isGateWaypoint(props) && styles.indentedContainer }),
      reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(nothingWhenNotStartOrFinishGate(SameStartFinish)),
      nothingWhenNotAGate(nothingWhenEmptyWaypoint(GateNameDropdown)),
      nothingWhenNotAGate(nothingWhenEmptyWaypoint(nothingWhenNotEditingGateName(ShortAndLongName.contramap(merge({ items: gateNameInputData(props), isGateEdit: true }))))),
      nothingWhenStartOrFinishGate(nothingWhenNotAGate(nothingWhenEmptyWaypoint(PassingInstructions))),
      nothingWhenEmptyWaypoint(nothingWhenNotAGate(GateMarkSelector))
    ])),
    when(always(isGateWaypoint(props)), view({ style: styles.gateEditContainer })),
    reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(MarkPropertiesDropdown),
      nothingWhenEmptyWaypoint(nothingWhenNoShowMarkProperties(MarksOrMarkPropertiesOptionsList)),
      nothingWhenEmptyWaypoint(nothingWhenNoShowMarkProperties(CreateNewSelector.contramap(merge({ insideGate: isGateWaypoint(props) })))),
      nothingWhenEmptyWaypoint(nothingWhenNotEditingMarkName(ShortAndLongName.contramap(merge({ items: markNamesInputData(props) })))),
      nothingWhenGate(nothingWhenEmptyWaypoint(PassingInstructions)),
      nothingWhenEmptyWaypoint(MarkPosition),
      //nothingWhenEmptyWaypoint(Appearance),
      nothingWhenNotEmptyWaypoint(CreateNewSelector),
      nothingWhenNotEmptyWaypoint(MarksOrMarkPropertiesOptionsList),
      nothingWhenStartOrFinishGate(DeleteButton)
  ]))

const AddButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      style: styles.addButton,
      onPress: (props: any) =>
        props.addWaypoint({ index: props.index, id: uuidv4() })
     }))(
    plusIcon))

const waypointItemToComponent = (waypoint: any, index: number, list: any[]) => Component((props: any) => compose(
  fold(props),
  when(always(isWaypointSelected(waypoint, props)),
    index === list.length - 1 ?
      concat(AddButton.contramap(merge({ index }))) :
      concat(__, AddButton.contramap(merge({ index: index + 1 })))),
  touchableOpacity({
    onPress: (props: any) => props.selectWaypoint(waypoint.id),
    style: [
      EStyleSheets.child(styles, 'waypointContainer', index, list.length),
      isWaypointSelected(waypoint, props) && styles.selectedWaypoint
    ]
  }),
  text({ style: styles.waypointText }))(
  props.waypointLabel(waypoint)))

const WaypointsList = Component(props => compose(
  fold(props),
  scrollView({ style: styles.waypointsContainer, horizontal: true }),
  reduce(concat, nothing()),
  insert(props.course.waypoints.length - 1,
    nothingWhenSelectedWaypoint(AddButton.contramap(merge({ index: props.course.waypoints.length - 1 })))),
  mapIndexed(waypointItemToComponent),
  path(['course', 'waypoints']))(
  props))

const LoadingIndicator = Component(props => compose(
  fold(props),
  view({ style: styles.loadingContainer }))(
  text({ style: styles.loadingText }, 'Loading course...')))

const NavigationBackHandler = Component(props => compose(
  fold(props),
  contramap(merge({
    onWillBlur: payload => {
      if (payload.state) return

      Alert.alert('Would you like to save the course?', '',
        [ { text: 'Don\'t save'},
          { text: 'Save', onPress: async () => {
            await props.saveCourse()

            Snackbar.show({
              title: 'Course successfully saved',
              duration: Snackbar.LENGTH_LONG
            })
          }} ])
    }
  })),
  fromClass)(
  NavigationEvents))

export default Component((props: object) =>
  compose(
    fold(props),
    withEditingMarkName,
    withEditingGateName,
    withSelectedPositionType,
    connect(mapStateToProps, {
      selectWaypoint, removeWaypoint, selectMarkConfiguration, addWaypoint,
      toggleSameStartFinish, updateWaypointName, updateWaypointShortName, saveCourse,
      updateMarkConfigurationName, updateMarkConfigurationShortName, updateWaypointPassingInstruction,
      changeWaypointToNewMark, changeWaypointToNewLine, updateMarkConfigurationLocation,
      assignMarkPropertiesToMarkConfiguration, replaceWaypointMarkConfiguration,
      changeWaypointMarkConfigurationToNew }),
    scrollView({ style: styles.mainContainer, vertical: true, nestedScrollEnabled: true }),
    reduce(concat, nothing()))(
    [ NavigationBackHandler,
      nothingWhenNotLoading(LoadingIndicator),
      nothingWhenLoading(WaypointsList),
      nothingWhenLoading(nothingWhenNoSelectedWaypoint(WaypointEditForm)) ]))
