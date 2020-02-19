import { find, isEmpty } from 'lodash'
import React from 'react'
import { TextInputProps as RNTextInputProps, View, ViewProps } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { WrappedFieldProps } from 'redux-form'
import { Chevron } from 'react-native-shapes'

import {
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_BOAT_ID,
  FORM_KEY_BOAT_NAME,
  FORM_KEY_HANDICAP,
  FORM_KEY_NATIONALITY,
  FORM_KEY_SAIL_NUMBER,
  FORM_KEY_TEAM_IMAGE,
  FORM_KEY_TEAM_NAME,
} from 'forms/session'
import I18n from 'i18n'
import { TeamTemplate } from 'models'
import { getDefaultHandicap, hasHandicapChanged } from 'models/TeamTemplate'

import Text from 'components/Text'
import TextInput, { TextInputProps } from 'components/TextInput'

import { text } from 'styles/commons'
import styles from './styles'


const teamsToPickerItems = (teams: TeamTemplate[] = []) => teams.map(item => ({
  label: item.name,
  value: item.name,
}))

class FormTeamPicker extends React.Component<ViewProps & RNTextInputProps & WrappedFieldProps & TextInputProps & {
  label: string,
  teams: TeamTemplate[],
  isLoggedIn: boolean,
} > {

  public render() {
    const {
      label,
      teams,
      style,
      containerStyle,
      ...additionalProps
    } = this.props
    const {
      input: { name, onChange, ...restInput },
      meta: { touched: showError, error },
    } = (this.props as any)[FORM_KEY_TEAM_NAME]

    const shouldHighlight = error && showError
    const assistiveText = error && showError ? error : this.getAssistiveText(restInput.value)

    return (
      <View style={style}>
        <View style={[styles.container, containerStyle]}>
          <TextInput
            containerStyle={containerStyle}
            style={[styles.textInput, styles.inputContainer]}
            placeholder={label}
            onChangeText={onChange}
            highlight={shouldHighlight}
            {...restInput}
            {...additionalProps}
          />
          {
            isEmpty(teams) ? null :
            <RNPickerSelect
              placeholder={{
                label: I18n.t('text_placeholder_team_picker'),
                value: null,
              }}
              Icon={() => {
                return <Chevron size={1.5} color="white"/>;
              }}
              items={teamsToPickerItems(teams)}
              onValueChange={this.onSelectTeam}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.inputIOS,
                inputAndroid: styles.inputAndroid,
                underline: styles.underline,
                placeholder: styles.inputPlaceholder,
                iconContainer: styles.containerIcon,
                viewContainer: styles.containerPicker, //iOS container style
                headlessAndroidContainer: styles.containerPicker, //Android container style
              }}
              {...additionalProps}
            />
          }
        </View>
        {
          assistiveText &&
          <Text style={[text.assistiveText, shouldHighlight ? text.error : undefined]}>{assistiveText}</Text>
        }
      </View>
    )
  }

  protected getAssistiveText = (name: string) => {
    if (!name || !this.props.isLoggedIn) {
      return
    }
    const existingTeam = this.teamFromName(name)
    if (existingTeam) {
      const { input: { value: boatName } } = (this.props as any)[FORM_KEY_BOAT_NAME]
      const { input: { value: boatClass } } = (this.props as any)[FORM_KEY_BOAT_CLASS]
      const { input: { value: sailNumber } } = (this.props as any)[FORM_KEY_SAIL_NUMBER]
      const { input: { value: nationality } } = (this.props as any)[FORM_KEY_NATIONALITY]
      const { input: { value: handicap } } = (this.props as any)[FORM_KEY_HANDICAP]
      if (
        boatName !== existingTeam.boatName || boatClass !== existingTeam.boatClass ||
        sailNumber !== existingTeam.sailNumber ||  nationality !== existingTeam.nationality ||
        hasHandicapChanged(existingTeam.handicap, handicap)) {
        return I18n.t('text_hint_existing_team_update')
      }
      return undefined
    }
    return I18n.t('text_hint_new_team_created')
  }

  protected onSelectTeam = (name: string) => {
    const { input: { onChange: onChangeName } } = (this.props as any)[FORM_KEY_TEAM_NAME]
    const { input: { onChange: onChangeBoatName } } = (this.props as any)[FORM_KEY_BOAT_NAME]
    const { input: { onChange: onChangeClass } } = (this.props as any)[FORM_KEY_BOAT_CLASS]
    const { input: { onChange: onChangeSailNumber } } = (this.props as any)[FORM_KEY_SAIL_NUMBER]
    const { input: { onChange: onChangeNationality } } = (this.props as any)[FORM_KEY_NATIONALITY]
    const { input: { onChange: onChangeBoatId } } = (this.props as any)[FORM_KEY_BOAT_ID]
    const { input: { onChange: onChangeTeamImage } } = (this.props as any)[FORM_KEY_TEAM_IMAGE]
    const { input: { onChange: onChangeHandicap } } = (this.props as any)[FORM_KEY_HANDICAP]

    const team = this.teamFromName(name)
    onChangeName(name || null)
    onChangeBoatName((team && team.boatName) || null)
    onChangeClass((team && team.boatClass) || null)
    onChangeSailNumber((team && team.sailNumber) || null)
    onChangeNationality((team && team.nationality) || null)
    onChangeBoatId((team && team.id) || null)
    onChangeTeamImage((team && team.imageData) || null)
    onChangeHandicap((team && team.handicap) || getDefaultHandicap())
  }

  protected teamFromName = (name: string) => find(this.props.teams, { name })
}


export default FormTeamPicker
