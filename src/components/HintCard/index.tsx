import React from 'react'
import { Image, ImageSourcePropType, View, ViewProps, ViewStyle } from 'react-native'

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
  elementContainerStyle?: ViewStyle,
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
      elementContainerStyle,
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <View style={[container.largeHorizontalMargin, styles.innerContainer, elementContainerStyle]}>
          <View>
            <Image style={styles.image} source={imageSource}/>
            <Text style={[textStyles.claim, styles.title]}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={onPress}
          >
            {actionText}
          </TextButton>
        </View>
        {onCancelPress && <ImageButton
          style={styles.closeButton}
          source={Images.actions.close}
          onPress={onCancelPress}
        />}
      </View>
    )
  }
}

export default HintCard
