import { get, isEmpty } from 'lodash'
import React from 'react'
import {
  Image,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'
import {  TextInputMask } from 'react-native-masked-text'

import Images from '@assets/Images'

import Text from 'components/Text'

import { $importantHighlightColor, $secondaryTextColor } from 'styles/colors'
import { text } from 'styles/commons'
import styles, { DEFAULT_BAR_HEIGHT } from './styles'


export interface TextInputProps {
  error?: string
  hint?: string
  maskType?: string
  maxLines?: number
  autoGrow?: boolean
  secureTextEntry?: boolean
  inputRef?: (ref: any) => void
  onFocus?: () => void
  onBlur?: () => void
  containerStyle?: ViewStyle
  highlight?: boolean
}

class TextInput extends React.Component<ViewProps & RNTextInputProps & TextInputProps> {

  public state = {
    text: this.props.value || '',
    height: 0,
    isEntrySecured: true,
    isFocused: false,
  }

  private input?: any

  public render() {
    const {
      placeholder,
      error,
      hint,
      autoGrow,
      multiline,
      onChangeText,
      maskType,
      maxLines,
      secureTextEntry,
      inputRef,
      style,
      containerStyle,
      highlight,
      ...additionalProps
    } = this.props

    const { height, isFocused, text: stateText, isEntrySecured } = this.state

    const heightStyle = autoGrow && {
      height: Math.max(
        // get(inputStyle, 'height') || DEFAULT_BAR_HEIGHT,
        DEFAULT_BAR_HEIGHT,
        height,
      ),
    }

    let ComponentType: any = RNTextInput
    const maskTypeProps: any = {}
    if (maskType) {
      ComponentType = TextInputMask
      maskTypeProps.type = maskType
    }

    const showEntrySecuredToggle = secureTextEntry && !!stateText && stateText !== ''
    const showTopPlaceholder = placeholder && (!isEmpty(additionalProps.value) || isFocused)
    const assistiveText = error || hint
    const isHighlighted = error || highlight
    const highlightStyle = isHighlighted ? text.error : undefined

    return (
      <View style={style}>
        <TouchableWithoutFeedback
          onPress={this.onContainerPress}
        >
          <View style={[styles.container, containerStyle]}>
            <View
              style={[
                styles.inputContainer,
                showTopPlaceholder ? styles.containerWithTitle : styles.containerNoTitle,
              ]}
            >
              {showTopPlaceholder && <Text style={[styles.title, highlightStyle]}>{placeholder}</Text>}
              <ComponentType
                style={[styles.input, heightStyle]}
                onContentSizeChange={this.contentSizeChanged}
                onChangeText={this.onChangeText}
                ref={this.handleInputRef}
                value={stateText}
                underlineColorAndroid="transparent"
                multiline={multiline || autoGrow}
                secureTextEntry={secureTextEntry && isEntrySecured}
                placeholderTextColor={isHighlighted ? $importantHighlightColor : $secondaryTextColor}
                placeholder={isFocused ? null : placeholder}
                {...additionalProps}
                {...maskTypeProps}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
              />
            </View>
            {
              showEntrySecuredToggle &&
              <TouchableOpacity
                style={styles.securedToggleBtn}
                onPress={this.entrySecuredToggled}
              >
                <Image
                  style={styles.visibilityIcon}
                  source={isEntrySecured ? Images.actions.visibility : Images.actions.visibilityOff}
                />
              </TouchableOpacity>
            }
          </View>
        </TouchableWithoutFeedback>
        {assistiveText && <Text style={[text.assistiveText, highlightStyle]}>{assistiveText}</Text>}
      </View>

    )
  }

  protected contentSizeChanged = (event: any) => {
    this.setState({ height: event.nativeEvent.contentSize.height })
  }

  protected entrySecuredToggled = () => {
    this.setState({ isEntrySecured: !this.state.isEntrySecured })
  }

  protected handleInputRef = (ref: any) => {
    const { maskType, inputRef } = this.props
    this.input = maskType ? get(ref, 'refs.$input-text') || ref : ref
    return inputRef && inputRef(this.input)
  }

  protected onChangeText = (textValue: string) => {
    this.setState({ text: textValue })
    if (this.props.onChangeText) { this.props.onChangeText(textValue) }
  }

  protected onContainerPress = () => {
    if (this.input && this.input.focus) {
      this.input.focus()
    }
  }

  protected handleInputFocus = () => {
    if (this.props.onFocus) { this.props.onFocus() }
    this.setState({ isFocused: true })
  }

  protected handleInputBlur = () => {
    if (this.props.onBlur) { this.props.onBlur() }
    this.setState({ isFocused: false })
  }
}

export default TextInput
