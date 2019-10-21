import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { connect } from 'react-redux'

import AccountListItem from 'components/AccountListItem'
import I18n from 'i18n'
import User from 'models/User'
import {
  navigateToAppSettings,
  navigateToTeamList,
  navigateToUserProfile,
} from 'navigation'
import { container } from 'styles/commons'
import Images from '../../../../assets/Images'
import Image from '../../../components/Image'
import {
  getUserInfo,
  isLoggedIn as isLoggedInSelector,
} from '../../../selectors/auth'
import styles from './styles'

const EMPTY_VALUE = '-'

const loggedInItems = (user: User) => [
  {
    title: user.fullName || EMPTY_VALUE,
    subtitle: user.email || EMPTY_VALUE,
    icon: Images.info.competitor,
    big: true,
    onPress: navigateToUserProfile,
  },
  {
    title: I18n.t('caption_my_teams'),
    icon: Images.info.team,
    onPress: navigateToTeamList,
  },
]

const notLoggedInItems = [
  {
    title: I18n.t('caption_register'),
    subtitle: I18n.t('caption_login'),
    icon: Images.info.competitor,
    big: true,
    onPress: navigateToUserProfile,
  },
]

const settingsItem = {
  title: I18n.t('caption_settings'),
  icon: Images.actions.settings,
  onPress: navigateToAppSettings,
}

class AccountList extends React.Component<{
  isLoggedIn: boolean
  user: User
}> {
  public render() {
    const { isLoggedIn, user } = this.props

    const data = [
      ...(isLoggedIn ? loggedInItems(user) : notLoggedInItems),
      settingsItem,
    ]

    return (
      <View style={[container.main, styles.container]}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Image source={Images.account.account_placeholder} resizeMode="cover" style={styles.backendImage} />
          <Image source={Images.account.account_gradient} resizeMode="stretch" style={styles.gradient} />
          <Image source={Images.defaults.sap_logo} style={styles.sap_logo} />
          <Text style={styles.headline}>{I18n.t('tilte_Account').toUpperCase()}</Text>
        </View>
        <View style={{ width: '100%' , marginTop: 'auto' }}>
          <FlatList data={data} renderItem={this.renderItem} />
        </View>
      </View>
    )
  }

  private renderItem = ({ item }: any) => {
    const { title, subtitle, big, onPress } = item

    return (
      <AccountListItem
        title={title}
        subtitle={subtitle}
        // icon={icon}
        big={big}
        onPress={onPress}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: getUserInfo(state) || {},
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps)(AccountList)
