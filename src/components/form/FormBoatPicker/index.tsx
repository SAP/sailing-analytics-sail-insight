import { find, isEmpty } from 'lodash'
import React from 'react'
import { View, ViewProps } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { WrappedFieldProps } from 'redux-form'

import { FORM_KEY_BOAT_CLASS, FORM_KEY_BOAT_ID, FORM_KEY_BOAT_NAME, FORM_KEY_SAIL_NUMBER } from 'forms/session'
import I18n from 'i18n'
import { BoatTemplate } from 'models'

import Text from 'components/Text'
import TextInput from 'components/TextInput'

import { text } from 'styles/commons'
import styles from './styles'


const boatsToPickerItems = (boats: BoatTemplate[] = []) => boats.map(item => ({
  label: item.name,
  value: item.name,
}))

class FormBoatPicker extends React.Component<ViewProps & WrappedFieldProps & {
  label: string,
  boats: BoatTemplate[],
} > {

  public render() {
    const {
      label,
      boats,
      style,
    } = this.props
    const {
      input: { name, onChange, ...restInput },
      meta: { touched: showError, error },
      ...additionalProps
    } = (this.props as any)[FORM_KEY_BOAT_NAME]

    const shouldHighlight = error && showError
    const assistiveText = error && showError ? error : this.getAssistiveText(restInput.value)

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
          />
          {
            isEmpty(boats) ? null :
            <RNPickerSelect
              placeholder={{
                label: I18n.t('text_placeholder_boat_picker'),
                value: null,
              }}
              items={boatsToPickerItems(boats)}
              onValueChange={this.onSelectBoat}
              style={{
                inputIOS: styles.inputIOS,
                inputAndroid: styles.inputAndroid,
                underline: styles.underline,
              }}
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
    if (!name) {
      return
    }
    const existingBoat = this.boatFromName(name)
    if (existingBoat) {
      const { input: { value: boatClass } } = (this.props as any)[FORM_KEY_BOAT_CLASS]
      const { input: { value: sailNumber } } = (this.props as any)[FORM_KEY_SAIL_NUMBER]
      return boatClass !== existingBoat.boatClass || sailNumber !== existingBoat.sailNumber ?
        I18n.t('text_hint_existing_boat_update') :
        undefined
    }
    return I18n.t('text_hint_new_boat_created')
  }

  protected onSelectBoat = (name: string) => {
    const { input: { onChange: onChangeName } } = (this.props as any)[FORM_KEY_BOAT_NAME]
    const { input: { onChange: onChangeClass } } = (this.props as any)[FORM_KEY_BOAT_CLASS]
    const { input: { onChange: onChangeSailNumber } } = (this.props as any)[FORM_KEY_SAIL_NUMBER]
    const { input: { onChange: onChangeBoatId } } = (this.props as any)[FORM_KEY_BOAT_ID]

    const boat = this.boatFromName(name)
    onChangeName(name || null)
    onChangeClass((boat && boat.boatClass) || null)
    onChangeSailNumber((boat && boat.sailNumber) || null)
    onChangeBoatId((boat && boat.id) || null)
  }

  protected boatFromName = (name: string) => find(this.props.boats, { name })
}


export default FormBoatPicker
