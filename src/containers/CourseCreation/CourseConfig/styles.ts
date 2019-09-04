import EStyleSheets from 'react-native-extended-stylesheet' 

import { $Orange, $DarkBlue, $MediumBlue } from 'styles/colors'
import { withDefaultBoldFont, withDefaultFont, white } from 'styles/compositions/text'

const roundElementContainer = {
  width: 50,
  height: 50,
  borderWidth: 2,
  borderColor: 'white',
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 45,
  marginLeft: 45
}

const withPadding = {
  paddingLeft: 15,
  paddingRight: 15
}

export default EStyleSheets.create({
  $itemHeight: 80,

  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#476987',
  },

  waypointsContainer: {
    flexShrink: 0
  },

  waypointContainer: {
    width: 45,
    height: '$itemHeight',
    backgroundColor: '#1D3F4E',
    justifyContent: 'center',
    borderRightColor: '#476987',
    borderRightWidth: 1,
  },

  selectedWaypoint: {
    backgroundColor: '#476987'
  },

  'waypointContainer:first-child': {
    width: 130
  },

  'waypointContainer:last-child': {
    width: 130
  },

  waypointText: {
    ...white,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  addButton: {
    width: 45,
    height: '$itemHeight',
    backgroundColor: '#FF6C52',
    justifyContent: 'center'
  },

  sectionTitle: {
    ...withDefaultBoldFont,
    ...white,
    marginBottom: 10,
  },

  indentedSectionTitle: {
    marginTop: 25
  },

  editContainer: {
    //paddingTop: 15
  },

  indentedContainer: { ...withPadding },

  gateEditContainer: {
    ...withPadding,
    paddingTop: 15,
    backgroundColor: $MediumBlue,
  },

  passingInstruction: roundElementContainer,

  selectedPassingInstruction: {
    backgroundColor: '#1D3F4E',
    borderColor: '#1D3F4E'
  },

  passingInstructionContainer: {
    justifyContent: 'center',
    flexDirection: 'row'
  },

  gateMarkSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingBottom: 0
  },

  gateMarkSelectorItemContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  gateMarkSelectorItem: {
    ...roundElementContainer,
    marginRight: 0,
    marginLeft: 0
  },

  gateMarkSelectorText: {
    ...withDefaultFont,
    ...white
  },

  gateMarkSelectorItemSelected: {
    backgroundColor: '#1D3F4E',
    borderColor: '#1D3F4E'
  },

  locationContainer: {
    backgroundColor: $DarkBlue,
    padding: 10,
    borderRadius: 2,
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  locationSwitchText: {
    ...withDefaultFont,
    paddingLeft: 5
  },

  editPositionButton: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },

  pingPositionButton: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: $Orange,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 12,
    paddingBottom: 12
  },

  locationText: {
    ...withDefaultFont,
    ...white,
    textAlign: 'center',
  },

  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  coordinatesText: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5
  },

  pingText: {
    ...withDefaultBoldFont,
    color: $Orange,
    fontSize: 15
  },

  trackingText: {
    ...white,
    textAlign: 'center'
  }
})
