import React from 'react'
import { View, ViewProps } from 'react-native'

import { navigateToUserRegistration } from 'navigation'
import { container } from 'styles/commons'

import TextButton from 'components/TextButton'


class UserProfile extends React.Component<ViewProps> {

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
