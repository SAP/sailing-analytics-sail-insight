import EStyleSheets from 'react-native-extended-stylesheet'

const headerTitleStyleProps = { flexGrow: 1 }

export default EStyleSheets.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    paddingRight: '$mediumSpacing',
    paddingLeft: '$mediumSpacing',
    ...headerTitleStyleProps,
  },
  baseHeading: {
    alignSelf: 'stretch',
  },
  heading: {
    fontSize: '$regularLargeFontSize',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: '$smallFontSize',
  },
})
