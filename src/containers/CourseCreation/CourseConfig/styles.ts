import EStyleSheets from 'react-native-extended-stylesheet' 

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
    backgroundColor: '#476987',
  },

  waypointContainer: {
    width: 45,
    height: '$itemHeight',
    backgroundColor: '#1D3F4E',
    justifyContent: 'center',
    borderRightColor: '#476987',
    borderRightWidth: 1
  },

  'waypointContainer:first-child': {
    width: 130
  },

  'waypointContainer:last-child': {
    width: 130
  },

  waypointText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  selectedWaypoint: {
    backgroundColor: '#476987'
  },

  addButton: {
    width: 45,
    height: '$itemHeight',
    backgroundColor: '#FF6C52',
    justifyContent: 'center'
  },

  sectionTitle: {
    color: 'white',
    marginBottom: 10,
    fontFamily: 'sfcompact_regular'
  },

  editContainer: {
    paddingTop: 15
  },

  indentedContainer: { ...withPadding },

  gateEditContainer: {
    ...withPadding,
    paddingTop: 15,
    backgroundColor: '#263A49',
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
    marginTop: 30,
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
    color: 'white'
  },

  gateMarkSelectorItemSelected: {
    backgroundColor: '#1D3F4E',
    borderColor: '#1D3F4E'
  }
})
