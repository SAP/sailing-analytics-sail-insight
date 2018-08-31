import React from 'react'
import { View } from 'react-native'

import { navigateToUserRegistration } from 'navigation'
import { container } from 'styles/commons'

import TextButton from 'components/TextButton'


class UserProfile extends React.Component<{
  navigation: any,
} > {

  public render() {
    // TODO: remove register button
    return (
      <View style={container.main}>
        <TextButton
          style={{ padding: 20 }}
          onPress={navigateToUserRegistration}
        >
          REGISTER
        </TextButton>
      </View>
    )
  }
}

export default UserProfile
