import React from 'react'
import { FlatList, View } from 'react-native'
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
import {
  getUserInfo,
  isLoggedIn as isLoggedInSelector,
} from '../../../selectors/auth'

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
    icon: Images.header.team,
    onPress: navigateToTeamList,
  },
]

const notLoggedInItems = [
  {
    title: I18n.t('caption_login'),
    icon: Images.info.competitor,
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
      <View style={[container.main]}>
        <FlatList data={data} renderItem={this.renderItem} />
      </View>
    )
  }

  private renderItem = ({ item }: any) => {
    const { title, subtitle, icon, big, onPress } = item

    return (
      <AccountListItem
        title={title}
        subtitle={subtitle}
        icon={icon}
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
