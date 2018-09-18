import { get, isEmpty } from 'lodash'
import React from 'react'
import {
  Image,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native'
import { TextInputMask } from 'react-native-masked-text'

import Images from '@assets/Images'
import { $importantHighlightColor, $secondaryTextColor } from 'styles/colors'
import { text } from 'styles/commons'
import styles, { DEFAULT_BAR_HEIGHT } from './styles'

import Text from 'components/Text'


class TextInput extends React.Component<ViewProps & TextInputProps & {
  value?: string,
  placeholder?: string,
  error?: string,
  hint?: string,
  maskType?: string,
  maxLines?: number,
  autoGrow?: boolean,
  multiline?: boolean,
  secureTextEntry?: boolean,
  onChangeText?: (text: string) => void,
  inputRef?: (ref: any) => void,
  onFocus?: () => void,
  onBlur?: () => void,
}> {

  public state = {
    text: this.props.value || '',
    height: 0,
    isEntrySecured: true,
    isFocused: false,
  }

  private input?: any

  public contentSizeChanged = (event: any) => {
    this.setState({ height: event.nativeEvent.contentSize.height })
  }

  public entrySecuredToggled = () => {
    this.setState({ isEntrySecured: !this.state.isEntrySecured })
  }

  public handleInputRef = (ref: any) => {
    const { maskType, inputRef } = this.props
    this.input = maskType ? get(ref, 'refs.$input-text') || ref : ref
    return inputRef && inputRef(this.input)
  }

  public onChangeText = (textValue: string) => {
    this.setState({ text: textValue })
    if (this.props.onChangeText) { this.props.onChangeText(textValue) }
  }

  public onContainerPress = () => {
    if (this.input && this.input.focus) {
      this.input.focus()
    }
  }

  public handleInputFocus = () => {
    if (this.props.onFocus) { this.props.onFocus() }
    this.setState({ isFocused: true })
  }

  public handleInputBlur = () => {
    if (this.props.onBlur) { this.props.onBlur() }
    this.setState({ isFocused: false })
  }

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
    const showTopPlaceholder = placeholder  && (!isEmpty(stateText) || isFocused)
    const assistiveText = error || hint

    return (
      <View style={style}>
        <TouchableWithoutFeedback
          onPress={this.onContainerPress}
        >
          <View style={[styles.container]}>
            <View
              style={[
                styles.inputContainer,
                showTopPlaceholder ? styles.containerWithTitle : styles.containerNoTitle,
              ]}
            >
              {showTopPlaceholder && <Text style={[styles.title, error && text.error]}>{placeholder}</Text>}
              <ComponentType
                style={[styles.input, heightStyle]}
                onContentSizeChange={this.contentSizeChanged}
                onChangeText={this.onChangeText}
                ref={this.handleInputRef}
                value={stateText}
                underlineColorAndroid="transparent"
                multiline={multiline || autoGrow}
                secureTextEntry={secureTextEntry && isEntrySecured}
                placeholderTextColor={error ? $importantHighlightColor : $secondaryTextColor}
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
        {assistiveText && <Text style={[styles.assistiveText, error && text.error]}>{assistiveText}</Text>}
      </View>

    )
  }
}

export default TextInput
