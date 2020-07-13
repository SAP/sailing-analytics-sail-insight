import EStyleSheets from 'react-native-extended-stylesheet'

import { $siShadow } from 'styles/colors'

export default EStyleSheets.create({
  back: {
    paddingHorizontal: '$siGutter',
    paddingVertical: '$siBaseSpacing',
  },
  elevation: {
    ...$siShadow
  }
})
