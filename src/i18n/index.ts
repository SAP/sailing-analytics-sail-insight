import {I18nManager} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import { I18n as I18nJS } from 'i18n-js';

export const SupportedLocales: any = {
  da: 'da',
  de: 'de',
  en: 'en',
  es: 'es',
  fr: 'fr',
  it: 'it',
  ja: 'ja',
  pt: 'pt',
  ru: 'ru',
  sl: 'sl',
  zh: 'zh'
}

const translations = {
  [SupportedLocales.da]: require('./translations/da.json'),
  [SupportedLocales.de]: require('./translations/de.json'),
  [SupportedLocales.en]: require('./translations/en.json'),
  [SupportedLocales.es]: require('./translations/es.json'),
  [SupportedLocales.fr]: require('./translations/fr.json'),
  [SupportedLocales.it]: require('./translations/it.json'),
  [SupportedLocales.ja]: require('./translations/ja.json'),
  [SupportedLocales.pt]: require('./translations/pt.json'),
  [SupportedLocales.ru]: require('./translations/ru.json'),
  [SupportedLocales.sl]: require('./translations/sl.json'),
  [SupportedLocales.zh]: require('./translations/zh.json')
};

const defaultLanguage = { languageTag: 'en', isRTL: false };
const selectedLanguage = RNLocalize.findBestAvailableLanguage(Object.keys(translations)) || defaultLanguage;

I18nManager.forceRTL(selectedLanguage.isRTL);

const I18n = new I18nJS(translations);
I18n.locale = selectedLanguage.languageTag;
I18n.defaultLocale = defaultLanguage.languageTag;

export default I18n;
