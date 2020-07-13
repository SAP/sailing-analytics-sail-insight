import EStyleSheet from 'react-native-extended-stylesheet'
import { sanFranciscoSpacing } from 'react-native-typography'

import { isPlatformAndroid } from 'environment'

import { $siMediumBlue, $siWhite } from 'styles/colors'
import { $siMediumFontStack, $siBoldFontStack } from 'styles/fonts'

import { addOpacity } from 'helpers/color'

const formSegment = {
    width: '100%',
    flexGrow: 0,
    paddingHorizontal: '$siGutter',
    paddingVertical: '$siBaseSpacing * 2',
}
const formInputWrapper = {
    marginBottom: '$siBaseSpacing * 2'
}
const formInputAndLabelAndToogleButtonContainer = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
}
const formInputAndLabelContainer = {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    height: 52
}
const formLabel = Object.assign({
    height: 16,
    marginTop:1,
    marginBottom:3,
    color: addOpacity($siWhite, 0.5),
    fontSize: 13,
    ...$siBoldFontStack,
}, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(13),
})
const formLabelFocused = {
    ...formLabel,
    color: addOpacity($siWhite, 0.8),
}
const formLabelDisabled = {
    ...formLabel,
    color: addOpacity($siWhite, 0.3),
}
const formErrorLabel = {
    ...formLabel,
    color: '$siErrorRed'
}
const formInput = Object.assign({
    height: 27,
    paddingBottom: 0,
    paddingVertical: 0, // remove Android default padding
    paddingHorizontal: 0, // remove Android default padding
    borderBottomColor: addOpacity($siWhite, 0.2),
    borderBottomWidth: 1,
    color: addOpacity($siWhite, 0.8), // Not applied to placeholder: Done directlly via placeholderTextColor
    fontSize: 17,
    ...$siBoldFontStack,
}, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(17),
})
const formInputFocused = {
    ...formInput,
    color: '$siWhite', // Not applied to placeholder: Done directlly via placeholderTextColor
    borderBottomColor: '$siWhite',
}
const formInputDisabled = {
    ...formInput,
    color: addOpacity($siWhite, 0.5),
    borderBottomColor: addOpacity($siWhite, 0.1),
}
const formInputToggleButton = {
    position:'absolute',
    right: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
}
const formInputIconButtonIcon = {
    width: '$defaultIconSize',
    height: '$defaultIconSize',
    resizeMode: 'contain',
    tintColor: addOpacity($siWhite, 0.3),
}
const formInputiconButtonIconFocused = {
    ...formInputIconButtonIcon,
    tintColor: $siWhite
}
const formInputAssitiveText = Object.assign({
    color: addOpacity($siWhite, 0.5),
    fontSize: 11,
    marginTop: 4,
    ...$siMediumFontStack,
}, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(11),
})
const formInputAssitiveTextFocused = {
    ...formInputAssitiveText,
    color: '$siWhite',
}
const formInputAssitiveTextError = {
    ...formInputAssitiveText,
    color: '$siErrorRed',
}

export default EStyleSheet.create({
    formSegment1: Object.assign({
        backgroundColor: addOpacity($siMediumBlue, 0.16),
        ...formSegment
    }),
    formSegment2: Object.assign({
        backgroundColor: addOpacity($siMediumBlue, 0.08),
        ...formSegment
    }),
    formSegment3: Object.assign({
        backgroundColor: addOpacity($siMediumBlue, 0.02),
        ...formSegment
    }),
    lastFormSegment: Object.assign({
        backgroundColor: '$siDarkerBlue',
        ...formSegment,
        flexGrow: 2
    }),
    formTextInputWrapper: {
        ...formInputWrapper
    },
    formTextInputAndLabelAndToogleButtonContainer: {
        ...formInputAndLabelAndToogleButtonContainer
    },
    formTextInputAndLabelContainer: {
        ...formInputAndLabelContainer
    },
    formTextLabel: {
        ...formLabel
    },
    formTextLabelFocused: {
        ...formLabelFocused
    },
    formTextLabelDisabled: {
        ...formLabelDisabled
    },
    formTextErrorLabel: {
        ...formErrorLabel
    },
    formTextInput: {
        ...formInput
    },
    formTextInputFocused: {
        ...formInputFocused
    },
    formTextInputDisabled: {
        ...formInputDisabled
    },
    formTextInputIconButton: {
        ...formInputToggleButton
    },
    formTextInputIconButtonIcon: {
        ...formInputIconButtonIcon
    },
    formTextInputIconButtonIconFocused: {
        ...formInputiconButtonIconFocused
    },
    visibilityIcon: { },
    lockIcon: { },
    formTextInputAssitiveText: {
        ...formInputAssitiveText
    },
    formTextInputAssitiveTextFocused: {
        ...formInputAssitiveTextFocused
    },
    formTextInputAssitiveTextError: {
        ...formInputAssitiveTextError
    },
    formSelectInputWrapper: {
        ...formInputWrapper
    },
    formSelectInputAndLabelContainer: {
        ...formInputAndLabelContainer
    },
    formSelectLabel: {
        ...formLabel
    },
    formSelectErrorLabel: {
        ...formErrorLabel
    },
    formSelectInput: {
        ...formInput
    },
    formSelectInputAssitiveText: {
        ...formInputAssitiveText
    },
    formSelectInputAssitiveTextError: {
        ...formInputAssitiveTextError
    },
    formDivider: {
        height: 40,
        marginTop: -20,
        marginBottom: -20,
        backgroundColor: '$siTransparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    formDividerLine: {
        backgroundColor: addOpacity($siWhite, 0.2),
        height: 1,
        width: '18%',
    },
    formDividerText: {
        top: 1,
        height: 18,
        marginHorizontal: 4
    },
    formDividerButtonText: Object.assign({
        color: addOpacity($siWhite, 0.2),
        fontSize: 13,
        lineHeight: 16,
        ...$siBoldFontStack,
    }, isPlatformAndroid ? {} : {
        letterSpacing: sanFranciscoSpacing(13),
    })
})
