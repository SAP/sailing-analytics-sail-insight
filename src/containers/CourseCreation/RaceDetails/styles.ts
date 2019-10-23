import EStyleSheets from 'react-native-extended-stylesheet'

import { sectionHeaderStyle } from 'containers/session/EventCreation/styles'

export const lighterGray = '#C7C7C7'
export const darkerGray = '#C5C5C5'

export default EStyleSheets.create({
  mainContainer: {
    backgroundColor: '#1D3F4E'
  },
  detailsContainer: {
    paddingLeft: 10
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
    backgroundColor: '#4B7B90'
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
    backgroundColor: 'white'
  }
})
