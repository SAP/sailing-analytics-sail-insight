import React, { Component } from 'react'

import Images from '@assets/Images'
import { navigateToCheckIn } from 'navigation'
import { buttons, container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import ImageButton from 'components/ImageButton'
import RegattaList from 'components/RegattaList'

import { StyleSheetType } from 'helpers/types'
import styles from './styles'


class Welcome extends React.Component<{
  style?: StyleSheetType,
} > {
  public onAddPress = () => {
    navigateToCheckIn()
  }

  public render() {
    return (
      <GradientContainer style={container.main}>
        <RegattaList style={container.main} />
        <ImageButton
          style={[buttons.action, styles.addButton]}
          onPress={this.onAddPress}
          source={Images.actionables.add}
          circular={true}
        />
      </GradientContainer>
    )
  }
}

export default Welcome
