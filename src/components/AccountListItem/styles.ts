import EStyleSheets from 'react-native-extended-stylesheet'
import { $tinySpacing } from 'styles/dimensions'

export default EStyleSheets.create({
  buttonContainer: {
    backgroundColor: '#0E2A37',
    height: 70,
    marginBottom: $tinySpacing,
  },
  buttonContainerBig: {
    height: 100,
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: '$smallSpacing',
    marginRight: '$smallSpacing',
  },
  lowerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flex: 1.5,
    alignItems: 'center',
  },
  $iconSize: 25,
  $bigIconSize: 45,
  baseIcon: {
    height: '$iconSize',
    width: '$iconSize',
    resizeMode: 'contain',
  },
  bigIcon: {
    height: '$bigIconSize',
    width: '$bigIconSize',
  },
  textContainer: {
    flex: 8,
    paddingLeft: '$smallSpacing',
  },
  title: {
    color: '$primaryTextColor',
    fontSize: '$titleFontSize',
    fontWeight: 'bold',
  },
  titleWithoutSubtitle: {
    color: '$primaryTextColor',
    fontSize: '$largeFontSize',
  },
  subtitle: {
    color: '$secondaryTextColor',
    fontSize: '$regularFontSize',
    marginTop: $tinySpacing,
  },
  arrowContainer: {
    flex: 0.5,
  },
  actionIcon: {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    tintColor: '$primaryTextColor',
    resizeMode: 'contain',
  },
})
