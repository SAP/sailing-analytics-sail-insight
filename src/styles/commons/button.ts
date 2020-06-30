import EStyleSheet from 'react-native-extended-stylesheet'
import { sanFranciscoSpacing } from 'react-native-typography'

import { isPlatformAndroid } from 'environment'

import { $siHeavyFontStack } from 'styles/fonts'
import { withSecondaryHeavyFont, withSecondaryMediumFont } from 'styles/compositions/text'

const oldButtonStyles = {
  $textButtonTextColor: '$primaryButtonColor',
  $textButtonTextFontSize: '$largeFontSize',
  $actionIconSizeAddition: '$microSpacing*2',
  $navIconSpacing: '$smallSpacing+4',
  action: {
    backgroundColor: '$primaryButtonColor',
    padding: '$tinySpacing',
    width: 50,
    height: 50,
  },
  actionRectangular: {
    backgroundColor: '$primaryButtonColor',
    padding: 12,
    borderRadius: '$baseBorderRadius',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  actionFullWidth: {
    backgroundColor: '$primaryButtonColor',
    alignSelf: 'stretch',
    height: 56,
    borderRadius: '$baseBorderRadius',
  },
  actionText: {
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  trackingActionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '$titleFontSize',
    letterSpacing: -0.5,
  },
  trackingAction: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  textButtonText: {
    color: '$textButtonTextColor',
    // fontSize: '$textButtonTextFontSize',
    fontSize: 14,
    ...withSecondaryMediumFont,
  },
  textButtonSecondaryText: {
    color: '$textButtonTextColor',
    fontSize: '$textButtonTextFontSize',
    fontWeight: '300',
  },
  textButtonTextBig: {
    color: '$textButtonTextColor',
    fontSize: '$titleFontSize',
  },
  modalBack: {
    color: '$primaryButtonColor',
    fontSize: 17,
  },
  actionIcon: {
    tintColor: '$primaryButtonColor',
    width: 26,
    height: 26,
  },
  actionIconNavBar: {
    tintColor: '$primaryTextColor',
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    marginLeft: '$navIconSpacing',
    marginRight: '$navIconSpacing',
  },
  secondaryActionIcon: {
    tintColor: '$secondaryButtonColor',
    width: '$defaultIconSize+$actionIconSizeAddition',
    height: '$defaultIconSize+$actionIconSizeAddition',
    // padding: '$microSpacing',
  },

  closeButton: {
    width:       '$defaultIconSize',
    height:      '$defaultIconSize',
    position:    'absolute',
    top:         8,
    right:       0,
    resizeMode:  'contain',
    tintColor:   '$secondaryButtonColor',
    marginRight: '$smallSpacing',
    marginTop:   '$baseSpacing',
  }
}

const defaultButton = {
    width: '80%',
    height: '$siBaseSpacing * 7',
    marginBottom: '$siBaseSpacing',
    borderRadius: '$siBorderRadius'
}

const defaultButtonText = Object.assign({
    color: '$siWhite',
    fontSize: 24,
    paddingHorizontal: '$siGutter / 2',
    ...$siHeavyFontStack,
}, isPlatformAndroid ? {} : {
    letterSpacing: sanFranciscoSpacing(24),
})

export default EStyleSheet.create({

    // Keep these around for now
    ...oldButtonStyles,

    // Width modifiers
    fullWidth: {
        ...defaultButton,
        width: '100%',
    },
    shrinkWrapped: {
        ...defaultButton
    },

    // Importance
    primary: {
        ...defaultButton,
        backgroundColor: '$siSapYellow'
    },
    primaryText: { 
        ...defaultButtonText
    },
    secondary: {
        ...defaultButton,
        backgroundColor: '$siTransparent',
        borderColor: '$siWhite',
        borderWidth: 1,
    },
    secondaryText: {
        ...defaultButtonText
    },
    secondaryInverted: {
      ...defaultButton,
      backgroundColor: '$siWhite',
    },
    secondaryTextInverted: {
      ...defaultButtonText,
      color: '$siDarkerBlue'
    }
})
  