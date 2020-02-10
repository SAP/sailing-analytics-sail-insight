import EStyleSheets from 'react-native-extended-stylesheet'
import { Dimensions } from 'react-native'
import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'
import { withDefaultFont, withDefaultBoldFont } from 'styles/compositions/text'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

export default EStyleSheets.create({
  mainContainer: {
    backgroundColor: '#1D3F4E',
    flex: 1,
  },
  organizerContainer: {
    marginTop: '$smallSpacing',
    paddingLeft: 10,
  },
  competitorContainer: {
    backgroundColor: '#4B7B90',
    paddingTop: 10,
  },
  eventStatsContainer: {
    backgroundColor: 'white',
    borderRadius: 2,
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 5
  },
  eventTitle: {
    ...withDefaultBoldFont,
    fontSize: 20
  },
  sectionHeaderStyle,
  textHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$regularLargeFontSize',
  },
  raceNumberContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 0,
  },
  racesListContainer: {
    backgroundColor: '#4B7B90',
    flex: 1
  },
  raceItemContainer: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 2
  },

  raceTimeContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 60,
    flexDirection: 'row'
  },

  sapAnalyticsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '$delimiterColor'
  },

  sapAnalyticsButton: {
    borderWidth: 1,
    borderRadius: 25,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#526986',
    color: '#526986'
  },

  raceDetailsContainer: {
    flexDirection: 'row'
  },

  raceTimeText: {
    color: 'black',
    ...withDefaultFont,
    paddingBottom: 0
  },

  raceNameTimeContainer: {
    borderRightWidth: 1,
    borderRightColor: '$delimiterColor',
    width: Dimensions.get('window').width / 2 - 30,
    paddingBottom: 0
  },

  raceTimeTextSet: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  defineCourseText: {
    ...withDefaultBoldFont,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20
  }
})
