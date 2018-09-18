import React from 'react'
import { Image, ImageSourcePropType, View, ViewProps } from 'react-native'

import Images from '@assets/Images'
import { button, container, text as textStyles } from 'styles/commons'
import { registration } from 'styles/components'
import styles from './styles'

import ImageButton from 'components/ImageButton'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class HintCard extends React.Component<ViewProps & {
  imageSource: ImageSourcePropType,
  onPress?: () => void,
  onCancelPress?: () => void,
  title?: string,
  text?: string,
  actionText?: string,
} > {

  public render() {
    const {
      style,
      title,
      text,
      imageSource,
      actionText,
      onPress,
      onCancelPress,
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={[container.mediumHorizontalMargin, styles.innerContainer]}>
          <Image style={styles.image} source={imageSource}/>
          <Text style={[textStyles.claim, styles.title]}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={onPress}
          >
            {actionText}
          </TextButton>
        </View>
        <ImageButton
          style={styles.closeButton}
          source={Images.actions.close}
          onPress={onCancelPress}
        />
      </View>
    )
  }
}

export default HintCard
