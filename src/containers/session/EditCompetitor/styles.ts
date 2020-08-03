import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryBoldFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '$siDarkBlue',
    height: '100%',
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  competitorName: {
    color: 'white',
    fontSize: 20,
    letterSpacing: 0.2,
    // marginLeft: '$smallSpacing',
    marginBottom: 20,
    ...withSecondaryBoldFont,
  },
})
