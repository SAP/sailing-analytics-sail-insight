import { compose, concat, map, reduce, toUpper } from 'ramda'

import { Share } from 'react-native'

import I18n from 'i18n'

import {
  Component,
  fold,
  nothing,
} from 'components/fp/component'
import { text, touchableOpacity, view } from 'components/fp/react-native'
import { reviewButton } from 'containers/session/common'

const regattaTypeText = Component((props: object) => compose(
  fold(props),
  reduce(concat, nothing()),
  map(text({}))
)([
  'Regatta is unmanaged',
  'Event is open. Anyone with this link or QR code can join.',
]))

// TODO: Make this functional
const constructEventUrl = () => 'https://sailinsight20-app.sapsailing.com/publicInvite?regatta_name=%3Cphilipp%3E+Storagetest&secret=ea6e9ed0-7bc6-11e9-b600-c51a504a7804&server=https%3A%2F%2Fd-labs.sapsailing.com&event_id=ebd03bce-756a-45b8-95a6-3828aeced049'

const shareInviteLink = () => {
  const url = constructEventUrl()
  Share.share({ message: url })
}

const inviteButton = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    onPress: shareInviteLink,
    style: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: '25%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }),
  text({ style: { color: '#1897FE' }}),
  toUpper)(
  'Share invite link'))


export default Component((props: object) => compose(
  fold(props),
  view({ style: [] }),
  reduce(concat, nothing()))([
    text({}, 'Competitors'),
    regattaTypeText,
    inviteButton,
    reviewButton
  ]))
