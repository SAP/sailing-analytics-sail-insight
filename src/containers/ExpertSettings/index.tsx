import Images from '@assets/Images'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import React from 'react'
import { Alert, Image, View } from 'react-native'
import BackgroundGeolocation from 'react-native-background-geolocation'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import {  getFormFieldValue } from 'selectors/form'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import { updateServerUrlSetting, updateVerboseLoggingSetting } from '../../actions/settings'
import TextInputForm from '../../components/base/TextInputForm'
import EditItemSwitch from '../../components/EditItemSwitch'
import * as expertSettingsForm from '../../forms/settings'
import { navigateBack } from '../../navigation'
import { getServerUrlSetting, getVerboseLoggingSetting } from '../../selectors/settings'
import styles from './styles'

interface Props {
  formServer?: string,
  updateServerUrlSetting: (value: string) => void,
  verboseLogging: boolean,
  updateVerboseLoggingSetting: (value: boolean) => void,
}

class ExpertSettings extends TextInputForm<Props> {

  public state = {
    emailLoading: false,
  }

  public render() {
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Image style={image.headerMedium} source={Images.header.sailors}/>
          <View style={[registration.topContainer(), styles.textContainer]}>
            <Text style={registration.claim()}>
              <Text>{I18n.t('text_development_claim_01')}</Text>
              <Text style={text.claimHighlighted}>{I18n.t('text_development_claim_02')}</Text>
            </Text>
          </View>
        </View>
        <View style={container.smallHorizontalMargin}>
          <EditItemSwitch
            style={styles.item}
            title={I18n.t('text_verbose_logging')}
            switchValue={this.props.verboseLogging}
            onSwitchValueChange={this.props.updateVerboseLoggingSetting}
          />
        </View>
        <View style={[container.largeHorizontalMargin, styles.emailContainer]}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onLogToEmailSubmit}
            isLoading={this.state.emailLoading}
          >
            {I18n.t('caption_send_log_to_email')}
          </TextButton>
        </View>
        <View style={registration.bottomContainer()}>
          <Field
            label={I18n.t('text_base_server')}
            name={expertSettingsForm.FORM_KEY_SERVER_URL}
            component={FormTextInput}
            validate={[validateRequired]}
            keyboardType={'default'}
            returnKeyType="next"
            inputRef={this.handleInputRef(expertSettingsForm.FORM_KEY_SERVER_URL)}
            onSubmitEditing={this.handleOnSubmitInput(expertSettingsForm.FORM_KEY_SERVER_URL)}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.props.handleSubmit(this.onSubmit)}
          >
            {I18n.t('caption_save')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }

  protected onSubmit = async (values: any) => {
    await this.props.updateServerUrlSetting(values[expertSettingsForm.FORM_KEY_SERVER_URL])
    navigateBack()
  }

  protected onLogToEmailSubmit = () => {
    this.setState({ emailLoading: true })
    BackgroundGeolocation.emailLog('sailinsight@sailtracks.tv').then(() => {
      Alert.alert(I18n.t('caption_success'))
      navigateBack()
    }).catch(() => {
      Alert.alert(I18n.t('error_unknown'))
      this.setState({ emailLoading: false })
    })
  }
}

const mapStateToProps = (state: any) => {
  return {
    formServer: getFormFieldValue(expertSettingsForm.EXPERT_SETTINGS_FORM_NAME,
                                  expertSettingsForm.FORM_KEY_SERVER_URL)(state),
    initialValues: {
      [expertSettingsForm.FORM_KEY_SERVER_URL]: getServerUrlSetting(state),
    },
    verboseLogging: getVerboseLoggingSetting(state),
  }
}

export default connect(
  mapStateToProps,
  { updateServerUrlSetting, updateVerboseLoggingSetting },
)(reduxForm<{}, Props>({
  form: expertSettingsForm.EXPERT_SETTINGS_FORM_NAME,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(ExpertSettings))
