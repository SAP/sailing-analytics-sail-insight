import React, { Component } from 'react'

import { navigateToCheckIn } from 'navigation'
import { container, buttons } from 'styles/commons'
import Images from '@assets/Images'

import GradientContainer from 'components/GradientContainer'
import ImageButton from 'components/ImageButton'
import RegattaList from 'components/RegattaList'

import styles from './styles'


class Welcome extends Component {
  onAddPress = () => {
    navigateToCheckIn()
  }

  render() {
    return (
      <GradientContainer style={container.main}>
        <RegattaList style={container.main} />
        <ImageButton
          style={[buttons.action, styles.addButton]}
          onPress={this.onAddPress}
          source={Images.actionables.add}
          circular
        />
      </GradientContainer>
    )
  }
}

export default Welcome
