import { Dimensions } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet' 

import { $DarkBlue, $LightDarkBlue, $Orange } from 'styles/colors'
import { white, withDefaultBoldFont, withDefaultFont, withSecondaryBoldFont } from 'styles/compositions/text'

const roundElementContainer = {
  width: 50,
  height: 50,
  borderWidth: 2,
  borderColor: 'white',
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 45,
  marginLeft: 45,
}

const withPadding = {
  paddingLeft: 15,
  paddingRight: 15,
}

export default EStyleSheets.create({
  $itemHeight: 80,

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#476987',
  },

  waypointsContainer: {
    backgroundColor: '#1d3f4e',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    flexGrow: 0,
  },

  sectionTitle: {
    ...withDefaultBoldFont,
    ...white,
    marginBottom: 10,
  },

  indentedSectionTitle: {
    marginTop: 25,
  },

  editContainer: {
    paddingTop: 15,
    flexGrow: 1,
  },

  indentedContainer: { ...withPadding },

  gateEditContainer: {
    ...withPadding,
    paddingTop: 15,
    backgroundColor: $LightDarkBlue,
    flexGrow: 1,
  },

  passingInstruction: roundElementContainer,

  selectedPassingInstruction: {
    backgroundColor: '#1D3F4E',
    borderColor: '#1D3F4E',
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
    paddingBottom: 0,
  },

  gateMarkSelectorItemContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  gateMarkSelectorItem: {
    ...roundElementContainer,
    marginRight: 0,
    marginLeft: 0,
  },

  gateMarkSelectorText: {
    ...withDefaultFont,
    ...white,
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
    alignItems: 'stretch',
  },

  locationSwitchText: {
    ...withDefaultFont,
    paddingLeft: 5,
  },

  editPositionButton: {
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },

  pingPositionButton: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: $Orange,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },

  changeTrackingButton: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: $Orange,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
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
    alignItems: 'center',
  },

  coordinatesText: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
  },

  pingText: {
    ...withDefaultBoldFont,
    color: $Orange,
    fontSize: 15,
  },

  trackingText: {
    ...white,
    ...withDefaultBoldFont,
    fontSize: 18,
    textAlign: 'center'
  },

  changeTrackingText: {
    ...withDefaultBoldFont,
    color: $Orange,
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },

  deleteWaypointContainer: {
    margin: 40,
  },

  deleteWaypointButton: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },

  deleteButtonText: {
    ...withDefaultFont,
    ...white,
    paddingLeft: 5,
  },

  textInputLabel: {
    ...withDefaultBoldFont,
    ...white,
  },

  textInput: {
    backgroundColor: 'transparent',
    color: 'white',
  },

  textInputContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 0,
    paddingLeft: 0,
  },

  textInputInputContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderColor: 'white',
    borderRadius: 0,
    paddingHorizontal: 0,
  },

  sameStartFinishContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  sameStartFinishText: {
    ...withDefaultFont,
    ...white,
    paddingLeft: 5
  },

  createNewContainer: {
    paddingTop: 10,
    backgroundColor: $DarkBlue,
  },

  createNewClassContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },

  createNewTitle: {
    ...withDefaultBoldFont,
    ...white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },

  markNameEditContainer: {
    flexDirection: 'row',
  },

  markPropertiesDropdownTextContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },

  markPropertiesListItem: {
    height: 48,
    ...withDefaultFont,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C5C5C5',
    paddingLeft: 15,
    justifyContent: 'center'
  },

  markPropertiesListContainer: {
    maxHeight: 240
  },

  markPropertiesListItemText: {
    color: 'black'
  },

  markPropertiesDropdownText: {
    color: 'black',
    fontSize: 14,
    flex: 1,
    flexBasis: 1
  },

  markNameEditButton: {
    backgroundColor: $DarkBlue,
    padding: 15,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },

  loadingContainer: {
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },

  loadingText: {
    ...white,
    ...withDefaultFont,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20
  },
  
  editNameContainer: {
    flexDirection: 'row',
    padding: 7,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4
  }
})
