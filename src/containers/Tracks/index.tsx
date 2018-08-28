import React from 'react'
import { View } from 'react-native'

import { container } from 'styles/commons'


class Tracks extends React.Component<{
  navigation: any,
} > {

  public render() {
    return (
      <View style={container.main}/>
    )
  }
}

export default Tracks
