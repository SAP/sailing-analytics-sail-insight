import EStyleSheets from 'react-native-extended-stylesheet'
import { withSecondaryHeavyFont } from 'styles/compositions/text'

export default EStyleSheets.create({
  list: {
    backgroundColor: '$primaryBackgroundColor',
  },
  // keeps the last row above the floating "new boat" button (56 + margins)
  listContent: {
    paddingBottom: 56 + 20 + 15 + 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: '$largeSpacing',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  textStyle: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    ...withSecondaryHeavyFont,
  },
  addButton: {
    height: 56,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingLeft: '$largeSpacing',
    paddingRight: '$largeSpacing',
    borderRadius: '$baseBorderRadius',
    backgroundColor: '$primaryButtonColor',
    justifyContent: 'center',
  },
})
