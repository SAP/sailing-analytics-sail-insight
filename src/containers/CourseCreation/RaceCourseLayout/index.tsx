import { __, compose, always, both, path, when, move, length, subtract, curry, of as Rof,
  prop, map, reduce, concat, merge, defaultTo, any, take, props as rProps, dissoc, reject,
  objOf, isNil, not, equals, pick, ifElse, insert, complement, uncurryN, apply,
  propEq, addIndex, intersperse, gt, findIndex, unless, has, toUpper, head, isEmpty, either } from 'ramda'
import {
  Component, fold, fromClass, nothing, nothingAsClass, contramap,
  reduxConnect as connect,
  recomposeBranch as branch,
  recomposeWithState as withState,
  recomposeWithHandlers as withHandlers,
} from 'components/fp/component'
import { text, view, scrollView, touchableOpacity, forwardingPropsFlatList, svgGroup, svg, svgPath, svgText } from 'components/fp/react-native'
import { BackHandler, Alert, Keyboard } from 'react-native'
import uuidv4 from 'uuid/v4'
import { MarkPositionType, PassingInstruction } from 'models/Course'
import { getStore } from 'store'
import { selectWaypoint, removeWaypoint, addWaypoint, toggleSameStartFinish,
  selectMarkConfiguration, updateWaypointName, updateWaypointShortName,
  updateMarkConfigurationName, updateMarkConfigurationShortName,
  updateWaypointPassingInstruction, changeWaypointToNewMark, changeWaypointToNewLine,
  updateMarkConfigurationLocation, assignMarkOrMarkPropertiesToMarkConfiguration,
  replaceWaypointMarkConfiguration, changeWaypointMarkConfigurationToNew,
  navigateBackFromCourseCreation, updateMarkPosition } from 'actions/courses'
import { startLocalLocationUpdates, stopLocalLocationUpdates } from 'actions/locations'
import { getSelectedWaypoint, waypointLabel, getMarkPropertiesByMarkConfiguration,
  getEditedCourse, getCourseLoading, getSelectedMarkConfiguration, getSelectedMarkProperties,
  getSelectedMarkPosition, hasSameStartFinish, getSelectedMarkDeviceTracking,
  isDefaultWaypointSelection, hasEditedCourseChanged} from 'selectors/course'
import { getLocationStats } from 'selectors/location'
import { getFilteredMarkPropertiesAndMarksOptionsForCourse, getMarkPropertiesOrMarkForCourseByName } from 'selectors/inventory'
import { getHashedDeviceId } from 'selectors/user'
import { coordinatesToString } from 'helpers/utils'
import * as Screens from 'navigation/Screens'
import TextInputDeprecated from 'components/TextInputDeprecated'
import SwitchSelector from 'react-native-switch-selector'
import CheckBox from 'react-native-check-box'
import Images from '@assets/Images'
import IconText from 'components/IconText'
import { HeaderSaveTextButton, HeaderCancelTextButton } from 'components/HeaderTextButton'
import Dash from 'react-native-dash'
import { NavigationEvents } from '@react-navigation/compat'
import styles from './styles'
import { $MediumBlue, $Orange, $DarkBlue, $LightDarkBlue } from 'styles/colors'
import { Dimensions } from 'react-native'
import I18n from 'i18n'

const mapIndexed = addIndex(map)

const mapStateToProps = (state: any) => ifElse(
  getCourseLoading,
  always({ loading: true }),
  state => ({
    course: getEditedCourse(state),
    selectedWaypoint: getSelectedWaypoint(state),
    selectedMarkConfiguration: getSelectedMarkConfiguration(state),
    isDefaultWaypointSelection: isDefaultWaypointSelection(state),
    selectedMarkProperties: getSelectedMarkProperties(state),
    selectedMarkLocation: getSelectedMarkPosition(state),
    selectedMarkDeviceTracking: compose(
      defaultTo(I18n.t('text_course_creation_no_device_assigned')),
      unless(isNil, ifElse(
        propEq('trackingDeviceHash', getHashedDeviceId()),
        always(I18n.t('text_course_creation_this_device_is_used')),
        always(I18n.t('text_course_creation_a_device_is_tracking')))))(
      getSelectedMarkDeviceTracking(state)),
    waypointLabel: uncurryN(2, waypointLabel)(__, state),
    markPropertiesByMarkConfiguration: uncurryN(2, getMarkPropertiesByMarkConfiguration)(__, state),
    marksAndMarkPropertiesOptions: getFilteredMarkPropertiesAndMarksOptionsForCourse(state),
    sameStartFinish: hasSameStartFinish(state),
    hasCourseChanged: hasEditedCourseChanged(state),
    newGateMarkOptions: [
      getMarkPropertiesOrMarkForCourseByName('Gate Mark 1')(state),
      getMarkPropertiesOrMarkForCourseByName('Gate Mark 2')(state)],
    newLineMarkOptions: [
      getMarkPropertiesOrMarkForCourseByName('Line Mark 1')(state),
      getMarkPropertiesOrMarkForCourseByName('Line Mark 2')(state)]
  }))

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
const nothingWhenGate = branch(isGateWaypoint, nothingAsClass)
const nothingWhenNotAGate = branch(compose(not, isGateWaypoint), nothingAsClass)
const nothingWhenNotStartOrFinishGate = branch(compose(not, isStartOrFinishGate), nothingAsClass)
const nothingWhenStartOrFinishGate = branch(isStartOrFinishGate, nothingAsClass)
const nothingWhenEmptyWaypoint = branch(isEmptyWaypoint, nothingAsClass)
const nothingWhenNotEmptyWaypoint = branch(compose(not, isEmptyWaypoint), nothingAsClass)
const nothingWhenNotTrackingSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.TrackingDevice)), nothingAsClass)
const nothingWhenNotGeolocationSelected = branch(compose(not, propEq('selectedPositionType', MarkPositionType.Geolocation)), nothingAsClass)
const nothingWhenNotSelected = branch(compose(isNil, prop('selected')), nothingAsClass)
const nothingWhenNoMarkLocation = branch(compose(either(isNil, isEmpty), prop('selectedMarkLocation')), nothingAsClass)
const nothingWhenNotEditingGateName = branch(compose(equals(false), prop('editingGateName')), nothingAsClass)
const nothingWhenNotEditingMarkName = branch(compose(equals(false), prop('editingMarkName')), nothingAsClass)
const nothingWhenNoShowMarkProperties = branch(compose(equals(false), prop('showMarkProperties')), nothingAsClass)
const nothingWhenShowMarkProperties = branch(compose(equals(true), prop('showMarkProperties')), nothingAsClass)

const updateSelectedPositionType = (props: any) => { props.setSelectedPositionType(isEmpty(props.selectedMarkLocation) ? MarkPositionType.TrackingDevice : MarkPositionType.Geolocation) }
const withSelectedPositionType = withState('selectedPositionType', 'setSelectedPositionType', (props: any) => { return isEmpty(props.selectedMarkLocation) ? MarkPositionType.TrackingDevice : MarkPositionType.Geolocation })
const withEditingMarkName = withState('editingMarkName', 'setEditingMarkName', false)
const withEditingGateName = withState('editingGateName', 'setEditingGateName', false)
const withShowMarkProperties = withState('showMarkProperties', 'setShowMarkProperties', false)

const openGeolocationScreenWithPosition = curry((props, location) => compose(
  position => props.navigation.navigate(Screens.CourseGeolocation,
    { data: {
      selectedMarkConfiguration: props.selectedMarkConfiguration,
      currentPosition: position,
      markPosition: props.selectedMarkLocation } }),
  prop('coords'))(
  location))

const changeSelectedWaypointToNewLine = ({ passingInstruction, markOrMarkPropertiesOptions }, props) => {
  const markConfigurationIds = [uuidv4(), uuidv4()]

  props.changeWaypointToNewLine({
    id: props.selectedWaypoint.id,
    passingInstruction,
    markConfigurationIds
  })

  mapIndexed(
    (markOrMarkProperties, index) => markOrMarkProperties &&
      props.assignMarkOrMarkPropertiesToMarkConfiguration({
        id: markConfigurationIds[index],
        markOrMarkProperties
      }),
    markOrMarkPropertiesOptions)
}

const icon = compose(
  fromClass(IconText).contramap,
  always)

const lineIcon = icon({ source: Images.courseConfig.lineIcon, iconStyle: { width: 80, height: 80 } })
const gateIcon = icon({ source: Images.courseConfig.gateIcon, iconStyle: { width: 80, height: 80 } })
const markPortIcon = icon({ source: Images.courseConfig.markPortIcon, iconStyle: { width: 80, height: 80 } })
const markStarboardIcon = icon({ source: Images.courseConfig.markStarboardIcon, iconStyle: { width: 80, height: 80 } })
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
const arrowUp = ({ color = $LightDarkBlue, size = 25, iconStyle = { height: 12 } }: any = {}) => icon({
  source: Images.courseConfig.arrowUp,
  style: { justifyContent: 'flex-end', height: size },
  iconStyle: { tintColor: color, ...iconStyle } })

const dashLine = fromClass(Dash).contramap(always({
  style: { height: 50, width: 90, alignItems: 'center' },
  dashColor: 'white'
}))

const GateMarkSelectorItem = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.gateMarkSelectorItemContainer }),
    concat(__, nothingWhenNotSelected(arrowUp({ size: 35, iconStyle: { width: 37, height: 24 } }))),
    touchableOpacity({
      style: [ styles.gateMarkSelectorItem, props.selected ? styles.gateMarkSelectorItemSelected : null ],
      onPress: (props: any) => {
        props.selectMarkConfiguration(props.markConfigurationId)
        updateSelectedPositionType(props)}
      }),
    text({ style: styles.gateMarkSelectorText }),
    defaultTo(''),
    prop('shortName'),
    props.markPropertiesByMarkConfiguration)(
    props.markConfigurationId))

const GateMarkSelector = Component((props: object) =>
  compose(
    fold(props),
    concat(nothingWhenStartOrFinishGate(
      text(
        {style: [styles.sectionTitle, styles.indentedSectionTitle] },
        props.selectedWaypoint.passingInstruction === PassingInstruction.Line ?
          I18n.t('caption_course_creation_define_line_marks') :
          I18n.t('caption_course_creation_define_gate_marks')
      )
    )),
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
    fromClass(CheckBox).contramap(merge({
      isChecked: props.sameStartFinish,
      onClick: props.toggleSameStartFinish,
      checkBoxColor: 'white'
    })),
    text({ style: styles.sameStartFinishText }, I18n.t('text_course_creator_start_and_finish_same'))
  ]))

const MarkPositionTracking = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.locationContainer }),
    concat(text({ style: styles.trackingText }, props.selectedMarkDeviceTracking)),
    touchableOpacity({
      style: styles.changeTrackingButton,
      onPress: () => props.navigation.navigate(Screens.CourseTrackerBinding,
        { data: { selectedMarkConfiguration: props.selectedMarkConfiguration } })
    }))(
    text(
      { style: styles.changeTrackingText },
      toUpper(I18n.t('caption_course_creation_change_device'))
    )
  ))

const MarkPositionPing = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    style: styles.pingPositionButton,
    onPress: (props: any) => {
      const { lastLatitude, lastLongitude } = getLocationStats(getStore().getState())

      const location = { latitude: lastLatitude, longitude: lastLongitude }
      const markConfigurationId = props.selectedMarkConfiguration
      props.updateMarkConfigurationLocation({
        id: markConfigurationId,
        value: location
      })
      props.updateMarkPosition({ markConfigurationId, location })
    }
  }))(
  text({ style: [styles.locationText, styles.pingText] },
  I18n.t('caption_course_creator_ping_position').toUpperCase())))

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
      onPress: (props: any) => {
        if (isEmpty(props.selectedMarkLocation)) {
          const { lastLatitude, lastLongitude } = getLocationStats(getStore().getState())

          openGeolocationScreenWithPosition(props,
            { coords: { latitude: lastLatitude, longitude: lastLongitude }})
        } else {
          openGeolocationScreenWithPosition(props, { coords: props.selectedMarkLocation })
        }
      }}))(
    text({ style: styles.locationText },
    I18n.t('caption_course_creation_edit_position'))))

const locationTypes = [
  { value: MarkPositionType.TrackingDevice, label: I18n.t('caption_course_creation_tracker'), customIcon: trackerIcon.fold },
  { value: MarkPositionType.Geolocation, label: I18n.t('caption_course_creation_location'), customIcon: locationIcon.fold }]

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
      text({ style: [styles.sectionTitle, styles.indentedSectionTitle] }, I18n.t('caption_course_creator_locate')),
      PositionSelector,
      arrowUp({color: $DarkBlue }),
      nothingWhenNotTrackingSelected(MarkPositionTracking),
      nothingWhenNotGeolocationSelected(MarkPositionGeolocation)
    ]))

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
    text({ style: styles.deleteButtonText }, I18n.t('caption_course_creation_delete_this_mark'))))

const createNewMark = curry((passingInstruction, props) =>
  props.insideGate ? props.changeWaypointMarkConfigurationToNew({
    id: props.selectedWaypoint.id,
    oldId: props.selectedMarkConfiguration,
    newId: uuidv4()
  }) : props.changeWaypointToNewMark({
    id: props.selectedWaypoint.id,
    passingInstruction,
    markConfigurationIds: [uuidv4()]
  }))

const CreateNewSelector = Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.createNewContainer }),
    concat(text({ style: styles.createNewTitle }, I18n.t('caption_course_creator_create_new'))),
    view({ style: { ...styles.createNewClassContainer, justifyContent: props.insideGate ? 'center' : 'space-between' }}),
    reduce(concat, nothing()),
    when(always(equals(true, props.insideGate)), compose(Rof, head)))([
    touchableOpacity({ onPress: () => createNewMark(PassingInstruction.Port, props) },
      markPortIcon),
    touchableOpacity({ onPress: () => createNewMark(PassingInstruction.Starboard, props) },
      markStarboardIcon),
    touchableOpacity({
      onPress: () => changeSelectedWaypointToNewLine({
        passingInstruction: PassingInstruction.Line,
        markOrMarkPropertiesOptions: props.newLineMarkOptions
      }, props)
    }, lineIcon),
    touchableOpacity({
      onPress: () => changeSelectedWaypointToNewLine({
        passingInstruction: PassingInstruction.Gate,
        markOrMarkPropertiesOptions: props.newGateMarkOptions
      }, props)
    }, gateIcon) ]))

const TextInputWithLabel = Component((props: any) => compose(
  fold(props),
  view({ style: props.isShort ? { flexBasis: 10 } : { flexBasis: 50 }}),
  concat(__, fromClass(TextInputDeprecated)),
  text({ style: styles.textInputLabel, numberOfLines: 1 }))(
  props.inputLabel))

const gateNameInputData = props => [
  { inputLabel: I18n.t('caption_course_creator_name'),
    value: props.selectedWaypoint.controlPointName,
    onBlur: (value: string) => props.updateWaypointName({
      id: props.selectedWaypoint.id,
      value
    })
  },
  { inputLabel: I18n.t('caption_course_creator_short_name'),
    value: props.selectedWaypoint.controlPointShortName,
    onBlur: (value: string) => props.updateWaypointShortName({
      id: props.selectedWaypoint.id,
      value
    }) } ]

const markNamesInputData = props => [
  { inputLabel: I18n.t('caption_course_creator_name'),
    value: props.selectedMarkProperties.name,
    onBlur: (value: string) => props.updateMarkConfigurationName({
      id: props.selectedMarkConfiguration,
      value
    })
  },
  { inputLabel: I18n.t('caption_course_creator_short_name'),
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
          markConfigurationIds: [props.item.isMarkConfiguration ? props.item.id : markConfigurationId]
        })
      }

      if (props.item.isMarkConfiguration) {
        props.replaceWaypointMarkConfiguration({
          id: props.selectedWaypoint.id,
          oldId: markConfigurationId,
          newId: props.item.id
        })
      } else {
        const newId = uuidv4()

        props.changeWaypointMarkConfigurationToNew({
          id: props.selectedWaypoint.id,
          oldId: markConfigurationId,
          newId
        })

        props.assignMarkOrMarkPropertiesToMarkConfiguration({
          id: newId,
          markOrMarkProperties: props.item
        })
      }
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

const marksAndMarkPropertiesWithoutTheOtherGateSideMark = (props: any) => {
  const otherSideId = compose(
    head,
    reject(equals(props.selectedMarkConfiguration)),
    defaultTo([]),
    prop('markConfigurationIds'))(
    props.selectedWaypoint)
  return reject(propEq('id', otherSideId), props.marksAndMarkPropertiesOptions)
}

const MarksOrMarkPropertiesOptionsList = Component((props: object) => compose(
    fold(props),
    scrollView({ style: styles.markPropertiesListContainer, nestedScrollEnabled: true, flexGrow: 0 }))(
    forwardingPropsFlatList.contramap((props: any) =>
      merge({
        data: marksAndMarkPropertiesWithoutTheOtherGateSideMark(props),
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
        maxLength: index === 1 ? 4 : 100,
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
      isGateWaypoint(props) ? I18n.t('caption_course_creator_passing_line') : I18n.t('caption_course_creator_rounding_direction'))),
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
      nothingWhenStartOrFinishGate(nothingWhenNotAGate(nothingWhenEmptyWaypoint(GateNameDropdown))),
      nothingWhenStartOrFinishGate(nothingWhenNotAGate(nothingWhenEmptyWaypoint(nothingWhenNotEditingGateName(ShortAndLongName.contramap(merge({ items: gateNameInputData(props), isGateEdit: true })))))),
      nothingWhenEmptyWaypoint(nothingWhenNotAGate(GateMarkSelector))
    ])),
    when(always(isGateWaypoint(props)), view({ style: styles.gateEditContainer })),
    reduce(concat, nothing()))([
      nothingWhenEmptyWaypoint(MarkPropertiesDropdown),
      nothingWhenEmptyWaypoint(nothingWhenNoShowMarkProperties(MarksOrMarkPropertiesOptionsList)),
      nothingWhenStartOrFinishGate(nothingWhenEmptyWaypoint(nothingWhenNoShowMarkProperties(CreateNewSelector.contramap(merge({ insideGate: isGateWaypoint(props) }))))),
      nothingWhenEmptyWaypoint(nothingWhenNotEditingMarkName(ShortAndLongName.contramap(merge({ items: markNamesInputData(props) })))),
      nothingWhenGate(nothingWhenEmptyWaypoint(PassingInstructions)),
      nothingWhenEmptyWaypoint(MarkPosition),
      nothingWhenNotEmptyWaypoint(MarksOrMarkPropertiesOptionsList),
      nothingWhenNotEmptyWaypoint(CreateNewSelector),
      nothingWhenStartOrFinishGate(DeleteButton)
  ]))

const WaypointsList = Component(props => {
  const startWidth = 115
  const waypointWidth = 60
  const windowWidth = Dimensions.get('window').width
  let finishWidth = 175
  let svgWidth = startWidth + (props.course.waypoints.length - 1) * waypointWidth + finishWidth

  if (windowWidth > svgWidth) {
    finishWidth += (windowWidth - svgWidth)
    svgWidth += (windowWidth - svgWidth)
  }

  finishWidth = Math.round(finishWidth)

  const indexToAdd = compose(
    when(
      always(equals(true, props.isDefaultWaypointSelection)),
      always(props.course.waypoints.length - 2)),
    when(equals(props.course.waypoints.length - 1), subtract(__, 1)),
    findIndex(propEq('id', props.selectedWaypoint.id)))(
    props.course.waypoints)

  return compose(
    fold(props),
    scrollView({ style: styles.waypointsContainer,
      horizontal: true, showsHorizontalScrollIndicator: false }),
    svg({
      width: svgWidth,
      height: 80,
      viewBox: `0 0 ${svgWidth} 80`
    }),
    reduce(concat, nothing()),
    mapIndexed((waypoint, index) => {
      const isStart = index === 0
      const isFinish = index === props.course.waypoints.length
      const groupTransform = isStart ? null : `translate(${startWidth + (index - 1) * waypointWidth},0)`

      const pathData =
        isStart ? 'M132.736 40.158L115.924.5H.5v79.462h115.424z' :
        isFinish ? `M${finishWidth}.372.5H.755l16.936 39.926L.755 80h${finishWidth}.617z` :
        'M77 40.158 L60 .5 H.755 l17 39.658 l-17 39.8 h60 z'
      const textTransform = `translate(${isStart ? 43 : isFinish ? 65 : 37}, 47)`
      const textAnchor = isStart || isFinish ? 'start' : 'middle'
      const x = isStart || isFinish ? 0 : 17/2
      const onPressOut = () => {
        if (waypoint.isAdd) {
          props.addWaypoint({ index, id: uuidv4() })
        } else {
          props.selectWaypoint(waypoint.id)
          updateSelectedPositionType(props)
        }
      }

      return compose(
        svgGroup({
          transform: groupTransform,
          onPressOut
        }),
        concat(svgPath.contramap(always({
          d: pathData,
          fill: waypoint.isAdd ? '#f0ab00' : isWaypointSelected(waypoint, props) ? '#476987' : '#1d3f4e',
          stroke: '#476987'
        }))),
        ifElse(
          always(waypoint.isAdd),
          always(svgPath.contramap(always({
            d: 'M42.526 52.098 v-10.5 h-10.5 v-3 h10.5 v-10.5 h3 v10.5 h10.5 v3h -10.5 v10.5 z',
            fill: '#fff'
          }))),
          svgText({
            transform: textTransform,
            fill: '#fff',
            fontSize: 18,
            textAnchor,
            x,
            fontFamily: 'SFProDisplay-Bold',
            letterSpacing: '.016em'
          })))(
        props.waypointLabel(waypoint))
      }),
      insert(indexToAdd + 1, { isAdd: true }))(
      props.course.waypoints)
})

const LoadingIndicator = Component((props: any) => compose(
  fold(props),
  view({ style: styles.loadingContainer }))(
  text({ style: styles.loadingText }, I18n.t('caption_course_creator_loading'))))

const saveCourse = (props: any) => () => {
  const handleSave = () => {
    props.navigateBackFromCourseCreation({ navigation: props.navigation })
  }
  Keyboard.dismiss()
  setTimeout(() => handleSave(), 50)
}

const withOnNavigationBackPress = withHandlers({
  onNavigationCancelPress: (props: any) => () => {
    if (props.hasCourseChanged) {
      Alert.alert(I18n.t('caption_leave'), '',
      [ { text: I18n.t('button_yes'), onPress: () => props.navigation.goBack() },
      { text: I18n.t('button_no'), onPress: () => {} }])
    } else {
      props.navigation.goBack()
    }
  },
  onNavigationSavePress: saveCourse,
  onNavigationBackButtonPress: (props: any) => () => {
    if (props.hasCourseChanged) {
      Alert.alert(I18n.t('caption_unsaved_changes'), '',
        [ { text: I18n.t('button_save'), onPress: saveCourse(props)},
      { text: I18n.t('button_dont_save'), onPress: () => props.navigation.goBack() }])
    } else {
      props.navigation.goBack()
    }
    return true
  },

})

const NavigationBackHandler = Component((props: any) => compose(
  fold(props),
  contramap(merge({
    onWillBlur: (payload: any) => {
      BackHandler.removeEventListener('hardwareBackPress', props.onNavigationBackButtonPress)
      props.stopLocalLocationUpdates()
    },
    onWillFocus: (payload: any) => {
      BackHandler.addEventListener('hardwareBackPress', props.onNavigationBackButtonPress)
      props.navigation.setOptions({
        headerRight: HeaderSaveTextButton({
          onPress: () => {
            props.onNavigationSavePress()
          }
        }),
        headerLeft: HeaderCancelTextButton({
          onPress: () => {
            props.onNavigationCancelPress()
          }
        })
      })
      props.startLocalLocationUpdates()
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
      toggleSameStartFinish, updateWaypointName, updateWaypointShortName,
      updateMarkConfigurationName, updateMarkConfigurationShortName, updateWaypointPassingInstruction,
      changeWaypointToNewMark, changeWaypointToNewLine, updateMarkConfigurationLocation,
      assignMarkOrMarkPropertiesToMarkConfiguration, replaceWaypointMarkConfiguration,
      changeWaypointMarkConfigurationToNew, navigateBackFromCourseCreation,
      startLocalLocationUpdates, stopLocalLocationUpdates, updateMarkPosition }, null,
      { areStatePropsEqual: (next, prev) => compose(
          apply(equals),
          map(compose(dissoc('waypointLabel'), dissoc('markPropertiesByMarkConfiguration'))))(
          [next, prev]) }),
    withOnNavigationBackPress,
    scrollView({ style: styles.mainContainer, vertical: true, nestedScrollEnabled: true, contentContainerStyle: { flexGrow: 1 } }),
    reduce(concat, nothing()))(
    [ NavigationBackHandler,
      nothingWhenNotLoading(LoadingIndicator),
      nothingWhenLoading(WaypointsList),
      nothingWhenLoading(nothingWhenNoSelectedWaypoint(WaypointEditForm)) ]))
