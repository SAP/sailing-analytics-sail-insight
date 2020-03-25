import React, { ReactNode } from 'react'
import { FlatList, Text, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'
import * as Screens from 'navigation/Screens'
import AccountListItem from 'components/AccountListItem'
import I18n from 'i18n'
import User from 'models/User'
import { NavigationScreenProps } from 'react-navigation'
import { container } from 'styles/commons'
import Images from '../../../../assets/Images'
import Image from '../../../components/Image'
import {
  getUserInfo,
  isLoggedIn as isLoggedInSelector,
} from '../../../selectors/auth'
import styles from './styles'

const EMPTY_VALUE = '-'

const loggedInItems = (props: any) => [
  {
    title: props.user.fullName || EMPTY_VALUE,
    subtitle: props.user.email || EMPTY_VALUE,
    big: true,
    onPress: () => props.navigation.navigate(Screens.UserProfile),
  },
  {
    title: I18n.t('caption_my_teams'),
    onPress: () => props.navigation.navigate(Screens.TeamList),
  },
]

const notLoggedInItems = (props: Readonly<{ children?: ReactNode }> & Readonly<any>) => [
  {
    title: I18n.t('caption_register'),
    subtitle: I18n.t('caption_login'),
    big: true,
    onPress: () => props.navigation.navigate(Screens.RegisterCredentials),
  },
]

const settingsItem = (props: any) => ({
  title: I18n.t('caption_settings'),
  onPress: () => props.navigation.navigate(Screens.AppSettings),
})

const communicationsItem = (props: any) => ({
  title: I18n.t('caption_communications'),
  onPress: () => props.navigation.navigate(Screens.Communications),
})

class AccountList extends React.Component<ViewProps & NavigationScreenProps & {
  isLoggedIn: boolean
  user: User,
}> {
  public render() {
    const { isLoggedIn } = this.props

    const data = [
      ...(isLoggedIn ? loggedInItems(this.props) : notLoggedInItems(this.props)),
      settingsItem(this.props),
      communicationsItem(this.props),
    ]

    return (
      <View style={[container.main, styles.container]}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Image source={Images.account.account_placeholder} resizeMode="cover" style={styles.backendImage} />
          <Image source={Images.account.account_gradient} resizeMode="stretch" style={styles.gradient} />
          <Image source={Images.defaults.sap_logo} style={styles.sap_logo} />
          <Text style={styles.headline}>{I18n.t('title_your_account').toUpperCase()}</Text>
        </View>
        <View style={{ width: '100%' , marginTop: 'auto' }}>
          <FlatList data={data} renderItem={this.renderItem} scrollEnabled={false} />
        </View>
      </View>
    )
  }

  private renderItem = ({ item }: any) => {
    return (
      <AccountListItem
        title={item.title}
        subtitle={item.subtitle}
        big={item.big}
        onPress={item.onPress}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: getUserInfo(state) || {},
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps)(AccountList)
