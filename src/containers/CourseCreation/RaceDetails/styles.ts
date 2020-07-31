import EStyleSheets from 'react-native-extended-stylesheet'
import { Dimensions } from 'react-native'
import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'
import { withDefaultFont, withDefaultBoldFont, withSecondaryBoldFont } from 'styles/compositions/text'
import { $MediumBlue, $LightBlue } from 'styles/colors'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

export const arrowColor = $MediumBlue
export const clockIconColor = $LightBlue

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
    backgroundColor: '$MediumBlue',
    flex: 1
  },
  raceItemContainer: {
    marginTop: 15,
    marginRight: 15,
    marginLeft: 15,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    // paddingBottom: 15,
    borderRadius: 2
  },

  raceLastItemContainer: {
    marginBottom: 15,
  },

  raceNameText: {
    ...withSecondaryBoldFont,
    color: 'black',
    fontSize: 32
  },

  raceItemButtonContainer: {
    marginLeft: 20,
    flexDirection: 'column',
    flex: 1
  },

  iconStyle: {
    width: 20,
    height: 20
  },

  arrowRightContainerStyle: {
    paddingTop: 5,
    marginRight: 5
  },

  editIconContainerStyle: {
    paddingTop: 5,
    marginLeft: 10
  },

  clockIconContainerStyle: {
    paddingTop: 2,
    marginRight: 7
  },

  defineLayoutButtonContainer: {
    borderTopWidth: 1,
    borderTopColor: '$delimiterColor',
    height: 60,
    justifyContent: 'center',
  },

  raceTimeContainer: {
    paddingRight: 5,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sapAnalyticsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '$delimiterColor',
    paddingBottom: 10,
  },

  sapAnalyticsButton: {
    ...withSecondaryBoldFont,
    borderWidth: 1,
    borderRadius: 3,
    paddingBottom: 5,
    paddingTop: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '$LightBlue',
    color: '$LightBlue',
    fontSize: 12,
    letterSpacing: 0.8,
  },

  raceDetailsContainer: {
    flexDirection: 'row'
  },

  raceTimeText: {
    color: '$MediumBlue',
    ...withDefaultBoldFont,
    paddingBottom: 0,
    fontSize: 20,
  },

  raceNameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width / 2 - 30,
    paddingBottom: 0
  },

  defineCourseText: {
    ...withDefaultBoldFont,
    color: '$MediumBlue',
    fontSize: 20
  }
})
