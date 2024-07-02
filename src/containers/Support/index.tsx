import { __, compose, concat, reduce } from 'ramda'

import I18n from 'i18n'
import Images from '@assets/Images'
import { openEmailToContact } from 'helpers/user'
import * as Screens from 'navigation/Screens'

import { icon, text, touchableOpacity, view } from 'components/fp/react-native'
import { Component, fold, nothing } from 'components/fp/component'
import styles from './styles'
import { text as textStyle } from 'styles/commons'

const arrowRight = icon({
  source: Images.actions.arrowRight,
  iconTintColor: 'black'
})

const supportItem = (settings: any) => Component((props: any) => compose(
  fold(props),
  touchableOpacity({ style: styles.itemContainer, onPress: settings.onPress }),
  view({ style: { flexDirection: 'row' } }),
  reduce(concat, nothing())
)([
  text({ style: [textStyle.itemName, styles.itemText] }, settings.title),
  arrowRight
]))

const knownIssuesItem = Component((props: any) => fold(props)(supportItem({
  title: I18n.t('caption_known_issues'),
  onPress: () =>
    props.navigation.navigate(Screens.ZendeskSupport, {
      data: { supportType: 'KNOWN_ISSUES' },
    }),
})))

const faqItem = Component((props: any) => fold(props)(supportItem({
  title: I18n.t('caption_faq'),
  onPress: () =>
    props.navigation.navigate(Screens.ZendeskSupport, {
      data: { supportType: 'FAQ' },
    }),
})))

const contactSupportItem = supportItem({
  title: I18n.t('caption_contact_support'),
  onPress: openEmailToContact,
})

export default Component((props: any) => compose(
  fold(props),
  view({ style: styles.container }),
  reduce(concat, nothing()))([
    knownIssuesItem,
    faqItem,
    contactSupportItem
  ]))
