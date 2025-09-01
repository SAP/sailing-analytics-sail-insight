import Text from 'components/Text'
import { sortBy } from 'lodash'
import { isNil } from 'ramda'
import React from 'react'
import { Alert, TextInputProps as RNTextInputProps, TouchableOpacity, View, ViewProps } from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import { WrappedFieldProps } from 'redux-form'
import I18n from 'i18n'

import { assetApiEndpoint, selfTrackingApi } from '../../../api'
import { getApiServerUrl } from '../../../api/config'
import { BoatClassesBody } from '../../../api/endpoints/types'
import { getErrorDisplayMessage } from 'helpers/texts'

import Image from '../../Image'
import TextInput, { TextInputProps } from '../../TextInput'

import styles from './styles'

interface State {
  boatClasses: BoatClassesBody[],
  query: string,
  selected: boolean,
  focused: boolean,
}

class FormBoatClassInput extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps & TextInputProps & {
  label?: string,
  input?: any,
  meta?: any,
  query?: string,
  boatClasses?: any[],
}, State > {
  public readonly state: Readonly<State> = {
    boatClasses: [],
    selected: false,
    focused: true,
  }

  public componentDidMount() {
    this.setState({ query: this.props.input.value, boatClasses: this.props.boatClasses })

    if (!this.props.boatClasses) {
      selfTrackingApi().requestBoatClasses().then((boatClasses: BoatClassesBody[]) => {
        this.setState({ boatClasses })
      }).catch((err) => {
        Alert.alert(I18n.t('error_load_boat_classes'), getErrorDisplayMessage(err))
      })
    }
  }

  static getDerivedStateFromProps(props: any, _: any) {
    return {
      query: props.input.value
    }
  }

  public render() {
    const {
      label,
      input: { name, ...restInput } = { name: undefined },
      style,
      containerStyle,
      ...additionalProps
    } = this.props
    const { query, selected, focused } = this.state
    // sortby is to puts the suggestions that start with the string at the top
    // slice is to limit suggestions to 5 elements max
    const filteredData = sortBy(this.findBoatClass(query), boatclass =>
      !boatclass.name.toLowerCase().startsWith(query.trim().toLowerCase()),
    ).slice(0, 5)
    const comp = (a: string, b: string) => a.toLowerCase().trim() === b.toLowerCase().trim()
    const hideResults = !focused || selected

    return (
        <View>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              containerStyle={style}  // was: style
              data={
                filteredData.length === 1 && comp(query, filteredData[0].name)
                  ? [] as BoatClassesBody[]
                  : filteredData
              }
              value={query}
              renderTextInput={this.renderTextInput}
              inputContainerStyle={[styles.inputContainer, containerStyle]}
              listStyle={styles.list}
              hideResults={hideResults}
              flatListProps={{
                keyExtractor: (_, i) => String(i),
                renderItem: (item) => this.renderItem(item),  // RNU
                keyboardShouldPersistTaps: 'always',
              }}
              {...restInput}
              {...additionalProps}
            />
          </View>
        </View>
    )
  }

  protected findBoatClass = (query: string) => {
    if (query === '' || isNil(this.state.boatClasses)) {
      return []
    }

    const { boatClasses } = this.state
    return boatClasses.filter(boatclass => boatclass.name.toLowerCase().includes(query.trim().toLowerCase()))
  }

  protected handleChangeText = (text: string) => {
    this.setState({
      query: text,
      selected: false,
    })
  }

  protected setCurrentInput = (suggestionValue: any) =>  (event: any)  => {
    this.setState({
      query: suggestionValue,
      selected: true,
    })

    const { input } = this.props
    input.onChange(suggestionValue)
  }

  protected renderItem = ({ item }: any) => {
    console.log(item);
    const iconSource = item?.iconUrl ? { uri: assetApiEndpoint(getApiServerUrl())(item.iconUrl)() } : ''
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={this.setCurrentInput(item?.name || '')}>
          <Text>{item?.name || '-'}</Text>
          {iconSource ? (<Image style={styles.icon} source={iconSource} />) : null}
        </TouchableOpacity>
    )
  }

  protected renderTextInput = () => {
    const {
      label,
      input: { name, value, ...restInput } = { name: undefined },
      meta: { touched: showError, error } = { touched: () => {}, error: undefined },
      style,
      ...additionalProps
    } = this.props

    const { query }: Readonly<any> = this.state

    return <TextInput
      style={style}
      inputStyle={styles.input}
      placeholder={label}
      hideTopPlaceholder={false}
      defaultValue={query}
      error={showError ? error : undefined}
      onChangeText={this.handleChangeText}
      {...restInput}
      {...additionalProps}
      onBlur={this.onTextInputFocusChange(false)}
      onFocus={this.onTextInputFocusChange(true)}/>
  }

  protected onTextInputFocusChange = (focused: boolean) =>
    () => this.setState({ focused })
}

export default FormBoatClassInput
