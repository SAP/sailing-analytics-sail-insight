import I18n from 'react-native-i18n'

I18n.fallbacks = true

I18n.translations = {
  en: require('./translations/en.json'),
  de: require('./translations/de.json'),
}

export default I18n
