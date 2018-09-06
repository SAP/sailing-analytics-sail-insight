import EStyleSheet from 'react-native-extended-stylesheet'

import { button, container, text } from 'styles/commons'

const styles = EStyleSheet.create({
  claim: { marginTop: '7.5 %' },
  bottomContainer: {
    paddingTop: '$containerFixedMargin',
    paddingBottom: 37,
  },
  nextButton: { marginTop: 32 },
})

export default {
  claim: () => [
    text.claim,
    styles.claim,
  ],
  topContainer: () => [
    container.mediumHorizontalMargin,
    { alignSelf: 'stretch' },
  ],
  bottomContainer: () => [
    container.mediumHorizontalMargin,
    styles.bottomContainer,
  ],
  nextButton: () => [
    button.actionFullWidth,
    styles.nextButton,
  ],
  lowerButton: () => ({
    marginTop: 24,
  }),
}
