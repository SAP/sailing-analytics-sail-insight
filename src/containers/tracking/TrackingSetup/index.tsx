import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { shareSessionFromForm } from 'actions/sessions'
import * as sessionForm from 'forms/session'
import { getUnknownErrorMessage } from 'helpers/texts'
import I18n from 'i18n'
import { Session, TrackingSession } from 'models'
import { navigateToEditSession } from 'navigation'
import { getBoat } from 'selectors/boat'

import ImageButton from 'components/ImageButton'
import LineSeparator from 'components/LineSeparator'
import PropertyView from 'components/PropertyView'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { $primaryButtonColor } from 'styles/colors'
import { button, container, text } from 'styles/commons'
import styles from './styles'


class TrackingSetup extends React.Component<{
  session: Session,
  boat: any,
  shareSessionFromForm: (formName: string) => void,
} > {

  public state = { isShareSheetLoading: false }

  public onSharePress = async () => {
    await this.setState({ isShareSheetLoading: true })
    try {
      await this.props.shareSessionFromForm(sessionForm.SESSION_FORM_NAME)
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    } finally {
      this.setState({ isShareSheetLoading: false })
    }
  }

  public renderProperty({ label, input: { value } }: any) {
    return (
      <PropertyView
        style={styles.keyValue}
        propertyKey={label}
        propertyValue={value || I18n.t('text_empty_value_placeholder')}
      />
    )
  }

  public renderTitle({ input: { value } }: any) {
    return (
      <Text style={text.claim}>{value}</Text>
    )
  }

  public render() {
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Field
                label={I18n.t('text_track_name')}
                name={sessionForm.FORM_KEY_NAME}
                component={this.renderTitle}
              />
              <ImageButton
                style={button.secondaryActionIcon}
                source={Images.actions.pen}
                onPress={this.onEditPress}
              />
            </View>
            <Field
              label={I18n.t('text_track_name')}
              name={sessionForm.FORM_KEY_TRACK_NAME}
              component={this.renderProperty}
            />
            <Field
              label={I18n.t('text_boat')}
              name={sessionForm.FORM_KEY_BOAT_NAME}
              component={this.renderProperty}
            />
            <Field
              label={I18n.t('text_number')}
              name={sessionForm.FORM_KEY_SAIL_NUMBER}
              component={this.renderProperty}
            />
            <Field
              label={I18n.t('text_class')}
              name={sessionForm.FORM_KEY_BOAT_CLASS}
              component={this.renderProperty}
            />
            <Field
              label={I18n.t('text_team_name')}
              name={sessionForm.FORM_KEY_TEAM_NAME}
              component={this.renderProperty}
            />
            <Field
              label={I18n.t('text_privacy_setting')}
              name={sessionForm.FORM_KEY_PRIVACY_SETTING}
              component={this.renderProperty}
            />
          </View>
          <View style={styles.shareContainer}>
            <LineSeparator/>
            <TextButton
              style={styles.shareButton}
              textStyle={button.textButtonText}
              onPress={this.onSharePress}
              isLoading={this.state.isShareSheetLoading}
              loadingColor={$primaryButtonColor}
            >
              {I18n.t('caption_share_session')}
            </TextButton>
            <LineSeparator/>
          </View>
        </View>
        <TextButton
          style={[button.trackingAction, styles.startButton]}
          textStyle={button.trackingActionText}
        >
          {I18n.t('caption_start').toUpperCase()}
        </TextButton>
      </ScrollContentView>
    )
  }

  private onEditPress = () => navigateToEditSession(this.props.session)
}

const mapStateToProps = (state: any, props: any) => {
  const session: TrackingSession = props.navigation.state.params
  const boat = getBoat(session && session.boatName)(state)
  return {
    initialValues: {
      [sessionForm.FORM_KEY_NAME]: session.name,
      [sessionForm.FORM_KEY_TRACK_NAME]: session.trackName,
      [sessionForm.FORM_KEY_BOAT_NAME]: session.boatName,
      [sessionForm.FORM_KEY_SAIL_NUMBER]: session.sailNumber,
      [sessionForm.FORM_KEY_PRIVACY_SETTING]: session.privacySetting,
      [sessionForm.FORM_KEY_TEAM_NAME]: session.teamName,
      [sessionForm.FORM_KEY_BOAT_CLASS]: boat && boat.name,
    },
  }
}

export default connect(
  mapStateToProps,
  { shareSessionFromForm },
)(reduxForm({
  form: sessionForm.SESSION_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})((props: any) => <TrackingSetup {...props}/>))

