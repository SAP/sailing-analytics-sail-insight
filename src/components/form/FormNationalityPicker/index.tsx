import { getErrorDisplayMessage } from 'helpers/texts'
import { isEmpty, orderBy } from 'lodash'
import React from 'react'
import { Alert, TextInputProps as RNTextInputProps, View, ViewProps } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Chevron } from 'react-native-shapes'
import { WrappedFieldProps } from 'redux-form'
import { selfTrackingApi } from '../../../api'
import { CountryCodeBody } from '../../../api/endpoints/types'

import Text from 'components/Text'
import { TextInputProps } from 'components/TextInput'

import { text } from 'styles/commons'
import I18n from '../../../i18n'
import { $importantHighlightColor } from '../../../styles/colors'
import styles from './styles'

interface State {
  countryList: any,
  text: string,
}

const countryToPickerItems = (countryList: CountryCodeBody[] = []) => countryList
    .filter(o => o.threeLetterIocCode)
    .map(item => ({
      label: item.name,
      value: item.threeLetterIocCode,
    }))

class FormNationalityPicker extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps &
    TextInputProps & {  label?: string,
}, State > {

  public readonly state: Readonly<State> = {
    countryList: [{ label: 'Germany', value: 'GER' }],
    text: this.props.input.value || '',
  }

  public componentDidMount() {
    selfTrackingApi().requestCountryCodes().then((data: CountryCodeBody[]) => {
      const countryList = orderBy(
          countryToPickerItems(data),
          'label',
          'ASC',
      )
      this.setState({ countryList })
    }).catch((err) => {
      Alert.alert(I18n.t('error_load_nationalities'), getErrorDisplayMessage(err))
    })
  }

  public componentDidUpdate(prevProps: any) {
    if (this.props.input.value !== prevProps.input.value) {
      this.setState({ text: this.props.input.value })
    }
  }

  public render() {
    const {
      label,
      highlight,
      meta: { touched: showError, error },
      style,
      containerStyle,
      ...additionalProps
    } = this.props

    const { text: stateText } = this.state
    const placeholder = I18n.t('text_nationality')

    const showTopPlaceholder = placeholder && (!isEmpty(stateText))
    const assistiveText = error && showError ? error : undefined
    const isHighlighted = (error && showError) || highlight
    const highlightStyle = isHighlighted ? text.error : undefined
    return (
      <View style={style}>
        <View style={[styles.container, containerStyle]}>
            <View
              style={[
                styles.inputContainer,
                showTopPlaceholder ? styles.containerWithTitle : styles.containerNoTitle,
              ]}
            >
              {showTopPlaceholder && <Text style={[styles.title, highlightStyle]}>{placeholder}</Text>}
              <RNPickerSelect
                  placeholder={{
                    label: I18n.t('text_placeholder_nationality'),
                    value: null,
                  }}
                  items={this.state.countryList}
                  value={stateText}
                  Icon={() => {
                    return <Chevron size={1.5} color="white" />;
                  }}
                  onValueChange={this.onValueChange}
                  placeholderTextColor={isHighlighted ? $importantHighlightColor : 'white'}
                  useNativeAndroidPickerStyle={false}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                    underline: styles.underline,
                  }}
                  {...additionalProps}
              />
            </View>
          </View>
          {
            assistiveText &&
            <Text style={[text.assistiveText, highlightStyle]}>{assistiveText}</Text>
          }
      </View>
    )
  }

  public onValueChange = (itemValue: any) => {
    if (!itemValue) return
    const {
      input: { onChange },
    } = this.props

    onChange(itemValue)

    this.setState({ text: itemValue })
  }
}

export default FormNationalityPicker
