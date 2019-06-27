import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'

import { updateEventFilters } from 'actions/UI'
import {
  EVENT_FILTER_FORM_NAME,
  eventFilterFromFormValues,
  FORM_KEY_ALL,
  FORM_KEY_ARCHIVED,
  FORM_KEY_INVITED,
  FORM_KEY_OWN,
  getFormInitialValues,
} from 'forms/eventFilter'
import I18n from 'i18n'
import { navigateBack } from 'navigation'
import { getFormFieldValue } from 'selectors/form'

import FormCheckbox from 'components/form/FormCheckbox/input'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button } from 'styles/commons'
import styles from './styles'

interface Props {
  formFilterAll: boolean
  formFilterOwn: boolean
  formFilterInvited: boolean
  formFilterArchived: boolean,
  updateEventFilters: any,
}

class FilterSessions extends React.Component<Props & InjectedFormProps<{}, Props>> {
  public render() {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            {I18n.t('text_session_filter_header').toUpperCase()}
          </Text>
        </View>
        <View style={styles.selectionContainer}>
          <Field
            label={I18n.t('text_session_filter_all')}
            name={FORM_KEY_ALL}
            component={FormCheckbox}
          />
          <Field
            label={I18n.t('text_session_filter_own')}
            name={FORM_KEY_OWN}
            component={FormCheckbox}
          />
          <Field
            label={I18n.t('text_session_filter_invited')}
            name={FORM_KEY_INVITED}
            component={FormCheckbox}
          />
          <Field
            label={I18n.t('text_session_filter_archived')}
            name={FORM_KEY_ARCHIVED}
            component={FormCheckbox}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TextButton
            style={styles.button}
            textStyle={button.textButtonTextBig}
            onPress={navigateBack}
          >
            {I18n.t('caption_close')}
          </TextButton>
          <TextButton
            style={[button.actionFullWidth, styles.button]}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
          >
            {I18n.t('caption_confirm')}
          </TextButton>
        </View>
      </View>
    )
  }

  private onSubmit = (values: any) => {
    const eventFilters = eventFilterFromFormValues(values)
    this.props.updateEventFilters(eventFilters)
    navigateBack()
  }
}

const mapStateToProps = (state: any) => {
  const formFilterAll = getFormFieldValue(EVENT_FILTER_FORM_NAME, FORM_KEY_ALL)(state)
  const formFilterOwn = getFormFieldValue(EVENT_FILTER_FORM_NAME, FORM_KEY_OWN)(state)
  const formFilterInvited = getFormFieldValue(EVENT_FILTER_FORM_NAME, FORM_KEY_INVITED)(state)
  const formFilterArchived = getFormFieldValue(EVENT_FILTER_FORM_NAME, FORM_KEY_ARCHIVED)(state)

  return {
    formFilterAll,
    formFilterOwn,
    formFilterInvited,
    formFilterArchived,
    initialValues: getFormInitialValues(state),
  }
}

export default connect(mapStateToProps, { updateEventFilters })(reduxForm<{}, Props>({
  form: EVENT_FILTER_FORM_NAME,
})(FilterSessions))
