import React, { ChangeEvent } from 'react'
import { KeyboardType, NativeSyntheticEvent, TextInputChangeEventData, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'
import { compose, when, isEmpty, always, unless, includes, __, trim } from 'ramda'

import { saveTeam, SaveTeamAction } from 'actions/user'

import {
  FORM_KEY_BOAT_CLASS,
  FORM_KEY_BOAT_NAME,
  FORM_KEY_HANDICAP,
  FORM_KEY_SAIL_NUMBER,
  TEAM_FORM_NAME,
} from 'forms/team'
import { validateRequired } from 'forms/validators'

import { selfTrackingApi } from 'api'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { getErrorDisplayMessage } from 'helpers/texts'

import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'
import { getFormFieldValue } from '../../../selectors/form'

import { TeamTemplate } from 'models'
import { getDefaultHandicap } from 'models/TeamTemplate'

import * as Screens from 'navigation/Screens'
import { getScreenParamsFromProps } from 'navigation/utils'

import FormBoatClassInput from '../../../components/form/FormBoatClassInput'
import FormHandicapInput from '../../../components/form/FormHandicapInput'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInputForm from 'components/base/TextInputForm'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

interface Props {
  saveTeam: SaveTeamAction,
  isNetworkConnected: boolean,
  formSailNumber?: string,
  actionAfterSubmit?: any,
}

class RegisterBoat extends TextInputForm<Props> {

  public state = { error: null, isLoading: false, showMore: false }

  private toggleShowMore(e: Event) {
    e.preventDefault();
    this.setState({ showMore: !this.state.showMore })
  }

  private commonProps = {
    keyboardType: 'default' as KeyboardType,
  }

  public render() {
    const { error, isLoading } = this.state
    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.65 }}>
          <ScrollContentView style={styles.container}>
          <View style={styles.contentContainer}>
              <Text style={[text.h1, styles.h1]}>
                {I18n.t('title_add_boat_01')}
                <Text style={text.yellow}>{I18n.t('title_add_boat_02')}</Text>
                {I18n.t('title_add_boat_03')}
              </Text>
              <Text style={[text.mediumText, styles.introText]}>{I18n.t('text_add_boat_explainer')}</Text>
              <View style={form.formSegment1}>
                <Field
                  hint={I18n.t('text_hint_competitor_name')}
                  label={I18n.t('text_placeholder_competitor_name')}
                  name={FORM_KEY_BOAT_NAME}
                  component={FormTextInput}
                  onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_SAIL_NUMBER)}
                  inputRef={this.handleInputRef(FORM_KEY_BOAT_NAME)}
                  validate={[validateRequired]}
                  returnKeyType="next"
                  textContentType="name"
                  autoCompleteType="name"
                  {...this.commonProps} />
                <Field
                  label={I18n.t('text_placeholder_sail_number')}
                  name={FORM_KEY_SAIL_NUMBER}
                  component={FormTextInput}
                  onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_BOAT_CLASS)}
                  inputRef={this.handleInputRef(FORM_KEY_SAIL_NUMBER)}
                  validate={[validateRequired]}
                  returnKeyType="next"
                  {...this.commonProps} />
                <Field
                  label={I18n.t('text_placeholder_boat_class')}
                  name={FORM_KEY_BOAT_CLASS}
                  component={FormBoatClassInput}
                  inputRef={this.handleInputRef(FORM_KEY_BOAT_CLASS)}
                  validate={[validateRequired]}
                  autoCorrect={false}
                  {...this.commonProps} />
              </View>
              { !this.state.showMore &&
                <View style={form.formDivider}>
                  <View style={form.formDividerLine}></View>
                  <View style={form.formDividerText}>
                    <TextButton textStyle={form.formDividerButtonText} onPress={this.toggleShowMore.bind(this)}>
                      {I18n.t('text_more').toUpperCase()}
                    </TextButton>
                  </View>
                  <View style={form.formDividerLine}></View>
                </View>
              }
              { this.state.showMore &&
                <View style={form.formSegment2}>
                  <Field
                    label={I18n.t('text_handicap_label')}
                    name={FORM_KEY_HANDICAP}
                    component={FormHandicapInput} />
                </View>
              }
              <View style={form.lastFormSegment}>
                <TextButton
                  style={[button.primary, button.fullWidth, styles.addBoatButton]}
                  textStyle={button.primaryText}
                  onPress={this.props.handleSubmit(this.onSubmit)}
                  isLoading={this.state.isLoading}>
                    {I18n.t('caption_add_boat').toUpperCase()}
                </TextButton>
              </View>
            </View>
          </ScrollContentView>
        </LinearGradient>
      </ImageBackground>
    )
  }

  protected handleNationalityChanged = (event?: ChangeEvent<any> | NativeSyntheticEvent<TextInputChangeEventData>,
                                        newValue?: any, previousValue?: any) => {
    if (!this.props.formSailNumber || this.props.formSailNumber === previousValue) {
      this.props.change(FORM_KEY_SAIL_NUMBER, newValue)
    }
  }

  protected onSubmit = async (values: any) => {
    if (!this.props.isNetworkConnected) {
      showNetworkRequiredSnackbarMessage()
      return
    }

    try {
      this.setState({ isLoading: true, error: null })

      const sailNumber = values[FORM_KEY_SAIL_NUMBER]
      let countryList = []
      try {
        const countryCodeResponse = await selfTrackingApi().requestCountryCodes()
        countryList = countryCodeResponse.map(o => o.threeLetterIocCode).filter(o => !!o)
      } catch (err) {}
      const nationality = compose(
        when(always(isEmpty(countryList)), always(undefined)),
        unless(includes(__, countryList), always(undefined)),
        s => s.substring(0, 3),
        trim
      )(sailNumber)

      const createdBoat = await this.props.saveTeam({
        sailNumber,
        nationality,
        name: values[FORM_KEY_BOAT_NAME],
        boatClass: values[FORM_KEY_BOAT_CLASS],
        handicap: values[FORM_KEY_HANDICAP],
      } as TeamTemplate)

      if (this.props.actionAfterSubmit) {
        await this.props.actionAfterSubmit(createdBoat)
      } else {
        this.props.navigation.navigate(Screens.Main)
      }
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
    }
  }
}

const mapStateToProps = (state: any, props: any) => ({
  actionAfterSubmit: getScreenParamsFromProps(props)?.actionAfterSubmit,
  isNetworkConnected: isNetworkConnectedSelector(state),
  formSailNumber: getFormFieldValue(TEAM_FORM_NAME, FORM_KEY_SAIL_NUMBER)(state),
  initialValues: {
    [FORM_KEY_HANDICAP]: getDefaultHandicap(),
  }
})

export default connect(mapStateToProps, { saveTeam })(reduxForm<{}, Props>({
  form: TEAM_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(RegisterBoat))
