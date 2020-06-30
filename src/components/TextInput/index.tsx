import { flatten } from 'ramda'
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
import { TextInputMask } from 'react-native-masked-text'

import Images from '@assets/Images'

import Text from 'components/Text'

import { $siErrorRed, $siWhite } from 'styles/colors'
import { form } from 'styles/commons'
import { addOpacity } from 'helpers/color'


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
  hideTopPlaceholder: boolean
  onBlurWithoutText: boolean
}

class TextInput extends React.Component<ViewProps & RNTextInputProps & TextInputProps> {

  public state = {
    text: this.props.value || '',
    height: 0,
    isEntrySecured: true,
    isFocused: false,
  }

  private input?: any

  public componentWillReceiveProps(props) {
    this.setState({ text: props.value })
  }

  public render() {
    const {
      placeholder,
      hideTopPlaceholder,
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
      onBlurWithoutText,
      ...additionalProps
    } = this.props

    const { height, isFocused, text: stateText, isEntrySecured } = this.state

    const DEFAULT_BAR_HEIGHT = 30

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
    const showTopPlaceholder = !hideTopPlaceholder && placeholder && (!isEmpty(additionalProps.value) || isFocused)
    const assistiveText = error || hint

    return (
      <View style={[form.formTextInputWrapper]}>
        <TouchableWithoutFeedback onPress={this.onContainerPress}>
          <View style={[form.formTextInputAndLabelAndToogleButtonContainer]}>
            <View style={[form.formTextInputAndLabelContainer]}>
              {showTopPlaceholder && <Text style={[(isFocused ? form.formTextLabelFocused : form.formTextLabel), (error ? form.formTextErrorLabel : undefined)]}>{placeholder}</Text>}
              <ComponentType
                style={flatten([(isFocused ? form.formTextInputFocused : form.formTextInput), heightStyle])}
                onContentSizeChange={this.contentSizeChanged}
                onChangeText={this.onChangeText}
                ref={this.handleInputRef}
                underlineColorAndroid="transparent"
                multiline={multiline || autoGrow}
                secureTextEntry={secureTextEntry && isEntrySecured}
                placeholderTextColor={[error ? $siErrorRed : addOpacity($siWhite, 0.8)]}
                placeholder={isFocused ? null : placeholder}
                {...additionalProps}
                {...maskTypeProps}
                value={stateText}
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
              />
            </View>
            {
              showEntrySecuredToggle &&
              <TouchableOpacity
                style={form.formTextInputToggleButton}
                onPress={this.entrySecuredToggled}>
                <Image
                  style={[(isFocused ? form.formTextInputToggleButtonIconFocused : form.formTextInputToggleButtonIcon), form.showPasswordIcon]}
                  source={isEntrySecured ? Images.actions.visibility : Images.actions.visibilityOff}
                />
              </TouchableOpacity>
            }
          </View>
        </TouchableWithoutFeedback>
        {assistiveText && <Text style={[(isFocused ? form.formTextInputAssitiveTextFocused : form.formTextInputAssitiveText), (error ? form.formTextInputAssitiveTextError : undefined)]}>{assistiveText}</Text>}
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
    this.input = maskType ? get(ref, 'refs.$input-text') || ref : ref
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
    if (this.props.onBlur) {
      if (this.props.onBlurWithoutText) {
        this.props.onBlur()
      } else {
        this.props.onBlur(this.state.text)
      }
    }
    this.setState({ isFocused: false })
  }
}

export default TextInput
