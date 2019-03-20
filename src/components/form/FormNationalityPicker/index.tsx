import { isEmpty, orderBy } from 'lodash'
import React from 'react'
import { Picker, TextInputProps as RNTextInputProps, View, ViewProps } from 'react-native'
import { WrappedFieldProps } from 'redux-form'
import { selfTrackingApi } from '../../../api'
import { CountryCodeBody } from '../../../api/endpoints/types'

import Text from 'components/Text'
import { TextInputProps } from 'components/TextInput'

import { text } from 'styles/commons'
import I18n from '../../../i18n'
import { DEFAULT_BAR_HEIGHT } from '../../TextInput/styles'
import styles from './styles'

interface State {
  countryList: any,
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
  }

  public componentDidMount() {
    selfTrackingApi.requestCountryCodes().then((data: CountryCodeBody[]) => {
      const countryList = orderBy(
          countryToPickerItems(data),
          'label',
          'ASC',
      )
      this.setState({ countryList })
    })
  }

  public render() {
    const {
      label,
      highlight,
      input: { name, value, onChange, ...restInput },
      meta: { touched: showError, error },
      style,
      ...additionalProps
    } = this.props

    const heightStyle = { height: DEFAULT_BAR_HEIGHT }

    const placeholder = I18n.t('text_nationality')

    const shouldHighlight = error && showError
    const showTopPlaceholder = placeholder && (!isEmpty(value))
    const assistiveText = error && showError ? error : undefined
    const isHighlighted = error || highlight
    const highlightStyle = isHighlighted ? text.error : undefined
    return (
      <View style={style}>
        <View style={[styles.container]}>
            <View
              style={[
                styles.inputContainer,
                showTopPlaceholder ? styles.containerWithTitle : styles.containerNoTitle,
              ]}
            >
              {showTopPlaceholder && <Text style={[styles.title, highlightStyle]}>{placeholder}</Text>}

              <Picker
                style={[styles.input, heightStyle]}
                onValueChange={this.onValueChange}
                selectedValue={this.props.input.value}
                {...restInput}
                {...additionalProps}
              >
              { this.state.countryList.map((item: any) => (
                <Picker.Item label={item.label} value={item.value} />),
              )}
              </Picker>
            </View>
            {
              assistiveText &&
              <Text style={[text.assistiveText, shouldHighlight ? text.error : undefined]}>{assistiveText}</Text>
            }
          </View>
      </View>
    )
  }

  protected onValueChange = (itemValue: any, itemPosition: number) => {
    const {
      input: { onChange },
    } = this.props
    onChange(itemValue)
  }
}

export default FormNationalityPicker
