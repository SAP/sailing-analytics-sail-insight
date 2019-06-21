import EStyleSheet from 'react-native-extended-stylesheet'

import { button, container, text } from 'styles/commons'
import { $baseSpacing } from 'styles/dimensions'

const styles = EStyleSheet.create({
  claim: { marginTop: '7.5 %' },
  bottomContainer: {
    paddingTop: '$smallSpacing',
    paddingBottom: 37,
  },
  nextButton: { marginTop: 32 },
  errorTextSpacing: {
    alignSelf: 'center',
    marginTop: '$tinySpacing',
    paddingLeft: 20,
    paddingRight: 20
  },
})

export default {
  claim: () => [
    text.claim,
    styles.claim,
  ],
  topContainer: () => [
    container.largeHorizontalMargin,
    { alignSelf: 'stretch' },
  ],
  bottomContainer: () => [
    container.largeHorizontalMargin,
    styles.bottomContainer,
  ],
  nextButton: () => [
    button.actionFullWidth,
    styles.nextButton,
  ],
  lowerButton: () => ({
    marginTop: $baseSpacing,
  }),
  errorText: () => [
    text.error,
    styles.errorTextSpacing,
  ],
}
