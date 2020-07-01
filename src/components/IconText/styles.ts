import EStyleSheet from 'react-native-extended-stylesheet'

import { text } from 'styles/commons'

export default EStyleSheet.create({
    baseItem: {
        alignItems: 'center',
    },
    baseIcon: {
        height: 24,
        width: 24,
        resizeMode: 'contain'
    },
    baseText: {
      ...text.text,
      color: '$siWhite'
    },
    separator: {
        height: 0,
        width: 4,
    }
})
