import React from 'react'
import { View } from 'react-native'

import { container } from 'styles/commons'


class TrackingSetup extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <View style={container.main}/>
    )
  }
}

export default TrackingSetup
