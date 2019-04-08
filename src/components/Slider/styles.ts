import EStyleSheet from 'react-native-extended-stylesheet'

export default EStyleSheet.create({
  $thumbSize: 12,
  thumbStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 0.2,
    shadowColor: '#aaa',
    shadowOffset: { height: 0, width: 0 },
    overflow: 'visible',
    height: '$thumbSize',
    width: '$thumbSize',
    borderRadius: '$thumbSize/2',
  },
  trackStyle: {
    height: 2,
  },
})
