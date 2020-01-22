import EStyleSheets from 'react-native-extended-stylesheet'

import { $primaryActiveColor } from 'styles/colors'
import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'
import { white, withDefaultFont, withDefaultBoldFont } from 'styles/compositions/text'

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
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginRight: 15,
    marginBottom: 5,
    marginLeft: 15
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
    marginTop: 5,
    marginRight: 15,
    marginBottom: 5,
    marginLeft: 15,
    height: 60,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  raceTimeContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#123748',
    height: 60,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },

  raceTimeContainerWithTime: {
    backgroundColor: $primaryActiveColor,
  },

  raceTimeText: {
    ...white,
    ...withDefaultFont,
  },

  raceTimeTextSet: {
    fontSize: 20,
  },

  raceNameText: {
    ...withDefaultBoldFont,
    color: 'black',
    fontSize: 20
  },

  raceDateAndTimeContainer: {
    marginLeft: 5,
    marginRight: 5,
    flexShrink: 0,
    flexGrow: 1
  }
})
