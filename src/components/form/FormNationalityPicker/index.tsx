import { orderBy } from 'lodash'
import React from 'react'
import { TextInputProps as RNTextInputProps, View, ViewProps } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { WrappedFieldProps } from 'redux-form'
import { selfTrackingApi } from '../../../api'
import { CountryCodeBody } from '../../../api/endpoints/types'

import Text from 'components/Text'
import TextInput, { TextInputProps } from 'components/TextInput'

import { text } from 'styles/commons'
import styles from './styles'

interface State {
  countryList: {},
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
      input: { name, onChange, ...restInput },
      meta: { touched: showError, error },
      style,
      ...additionalProps
    } = this.props

    const shouldHighlight = error && showError
    const assistiveText = error && showError ? error : undefined

    return (
        <View style={style}>
          <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder={label}
                onChangeText={onChange}
                highlight={shouldHighlight}
                {...restInput}
                {...additionalProps}
                editable={false}
            />
          <RNPickerSelect
              items={this.state.countryList}
              onValueChange={onChange}
              style={{
                inputIOS: styles.inputIOS,
                inputAndroid: styles.inputAndroid,
                underline: styles.underline,
              }}
              {...restInput}
          />
          </View>
          {
            assistiveText &&
            <Text style={[text.assistiveText, shouldHighlight ? text.error : undefined]}>{assistiveText}</Text>
          }
        </View>
    )
  }
}
export default FormNationalityPicker
