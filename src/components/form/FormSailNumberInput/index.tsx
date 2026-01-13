import Text from 'components/Text'
import React from 'react'
import { TextInputProps as RNTextInputProps, TouchableOpacity, View, ViewProps } from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import { connect } from 'react-redux'
import { WrappedFieldProps } from 'redux-form'

import { TeamTemplate } from 'models'
import { getUserTeams } from 'selectors/user'

import TextInput, { TextInputProps } from '../../TextInput'
import styles from './styles'

interface State {
  queryTeams: TeamTemplate[],
  query: string,
}

class FormSailNumberInput extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps & TextInputProps & {
  label?: string,
  input?: any,
  teams: TeamTemplate[],
  meta?: any,
  onSelectTeam: (team: TeamTemplate) => void
}, State > {

  public readonly state: Readonly<State> = {
    queryTeams: [],
    query: '',
  }

  public render() {
    const {
      label,
      input: { name, ...restInput },
      style,
      ...additionalProps
    } = this.props
    const { query } = this.state
    const filteredData = this.findTeamsBySailNumber(query)
    const comp = (a: string, b: string) => a.toLowerCase().trim() === b.toLowerCase().trim()
    return (
        <View>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
                containerStyle={style}
                data={
                  filteredData.length === 1 && comp(query, filteredData[0]?.sailNumber ?? '')
                      ? []
                      : filteredData
                }
                value={query}
                renderTextInput={this.renderTextInput}
                inputContainerStyle={styles.inputContainer}
                listStyle={styles.list}
                flatListProps={{
                  keyboardShouldPersistTaps: 'always',
                  keyExtractor: (item, i) => String(i),
                  renderItem: ({ item, index }) => this.renderItem(item),
                }}
                {...restInput}
                {...additionalProps}
            />
          </View>
        </View>
    )
  }

  protected findTeamsBySailNumber = (query: string) => {
    if (query === '') {
      return []
    }

    const { teams } = this.props
    return teams.filter((team: any) => team?.sailNumber?.toLowerCase().includes(query.trim().toLowerCase()))
  }

  protected handleChangeText = (text: string) => {
    this.setState({ query: text })
  }

  protected selectTeam = (team: TeamTemplate) =>  (event: any)  => {
    this.setState({ query: team?.sailNumber ?? '' })

    const { input, onSelectTeam } = this.props
    input.onChange(team?.sailNumber ?? '')
    onSelectTeam(team)
  }

  protected renderItem = ({item}: any) => {
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={this.selectTeam(item)}
        >
          <Text>{item?.sailNumber ?? ''}</Text>
        </TouchableOpacity>
    )
  }

  protected renderTextInput = () => {
    const {
      label,
      input: { name, ...restInput },
      meta: { touched: showError, error },
      style,
      ...additionalProps
    } = this.props
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

const mapStateToProps = (state: any) => ({
  teams: getUserTeams(state)
})

export default connect(mapStateToProps)(FormSailNumberInput)
