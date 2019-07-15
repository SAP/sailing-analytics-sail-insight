import Text from 'components/Text'
import { sortBy } from 'lodash'
import React from 'react'
import { Alert, TextInputProps as RNTextInputProps, TouchableOpacity, View, ViewProps } from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import { WrappedFieldProps } from 'redux-form'
import I18n from 'i18n'

import { assetApiEndpoint, selfTrackingApi } from '../../../api'
import { getApiServerUrl } from '../../../api/config'
import { BoatClassesdBody } from '../../../api/endpoints/types'
import { getErrorDisplayMessage } from 'helpers/texts'

import Image from '../../Image'
import TextInput, { TextInputProps } from '../../TextInput'

import styles from './styles'

interface State {
  boatClasses: BoatClassesdBody[],
  query: string,
}

class FormBoatClassInput extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps & TextInputProps & {
  label?: string,
  input?: any,
  meta?: any,
}, State > {

  public readonly state: Readonly<State> = {
    boatClasses: [],
    query: '',
  }

  public componentDidMount() {
    selfTrackingApi().requestBoatClasses().then((boatClasses: BoatClassesdBody[]) => {
      this.setState({ boatClasses })
    }).catch((err) => {
      Alert.alert(I18n.t('error_load_boat_classes'), getErrorDisplayMessage(err))
    })
  }

  public render() {
    const {
      label,
      input: { name, ...restInput } = { name: undefined },
      style,
      ...additionalProps
    } = this.props
    const { query } = this.state
    // sortby is to puts the suggestions that start with the string at the top
    // slice is to limit suggestions to 5 elements max
    const filteredData = sortBy(this.findBoatClass(query), boatclass =>
      !boatclass.name.toLowerCase().startsWith(query.trim().toLowerCase()),
    ).slice(0, 5)
    const comp = (a: string, b: string) => a.toLowerCase().trim() === b.toLowerCase().trim()
    return (
        <View>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
                style={style}
                data={filteredData.length === 1 && comp(query, filteredData[0].name) ? [] : filteredData}
                defaultValue={query}
                renderTextInput={this.renderTextInput}
                renderItem={this.renderItem}
                inputContainerStyle={styles.inputContainer}
                listStyle={styles.list}
                {...restInput}
                {...additionalProps}
            />
          </View>
        </View>
    )
  }

  protected findBoatClass = (query: string) => {
    if (query === '') {
      return []
    }

    const { boatClasses } = this.state
    return boatClasses.filter(boatclass => boatclass.name.toLowerCase().includes(query.trim().toLowerCase()))
  }

  protected handleChangeText = (text: string) => {
    this.setState({ query: text })
  }

  protected setCurrentInput = (suggestionValue: any) =>  (event: any)  => {
    this.setState({ query: suggestionValue })

    const { input } = this.props
    input.onChange(suggestionValue)
  }

  protected renderItem = (item: BoatClassesdBody) => {
    const iconSource = item.iconUrl ? { uri: assetApiEndpoint(getApiServerUrl())(item.iconUrl)() } : ''
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={this.setCurrentInput(item.name)}
        >
          <Text>{item.name}</Text>
          {iconSource ? (<Image style={styles.icon} source={iconSource} />) : null}
        </TouchableOpacity>
    )
  }

  protected renderTextInput = () => {
    const {
      label,
      input: { name, ...restInput } = { name: undefined },
      meta: { touched: showError, error } = { touched: () => {}, error: undefined },
      style,
      ...additionalProps
    } = this.props

    console.log('####', restInput)

    const { query }: Readonly<any> = this.state
    return (
        <TextInput
            style={style}
            placeholder={label}
            defaultValue={query}
            error={showError ? error : undefined}
            onChangeText={this.handleChangeText}
            {...restInput}
            {...additionalProps}
        />
    )
  }
}

export default FormBoatClassInput
