import React from 'react'
import { Alert, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'
// import { isEmpty } from 'lodash'

import * as Screens from 'navigation/Screens'

import { logout, updateUser } from 'actions/auth'
import { fetchUserInfo } from 'actions/user'

import * as userForm from 'forms/user'
// import { validateRequired } from 'forms/validators'

import User from 'models/User'

import { getUserInfo } from 'selectors/auth'
import { getFormFieldValue } from 'selectors/form'

import TextInputForm from 'components/base/TextInputForm'
// import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import Logger from '../../../helpers/Logger'
// import { getErrorDisplayMessage } from 'helpers/texts'

import I18n from 'i18n'

import Images from '@assets/Images'
import styles from './styles'
import { form,  button } from 'styles/commons'
import { $siDarkBlue, $siDarkerBlue } from 'styles/colors';

interface Props {
  user: User,
  formFullName?: string,
  logout: () => void,
  fetchUserInfo: () => void,
  updateUser: (u: User) => void,
}

class UserProfile extends TextInputForm<Props> {

  public state = {
    isLoading: false,
  }

  public componentDidMount() {
    this.props.fetchUserInfo()
  }

  public render() {
    const { user } = this.props

    // const canSave = this.formIsSaveable() && this.formHasChanges()
    // const isSaveDisabled = !canSave

    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.container}>
          <LinearGradient colors={[$siDarkBlue, $siDarkerBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: -0.2 }} end={{ x: 0.0, y: 0.3 }}>
            <View style={styles.contentContainer}>
              {/* <Field
                label={I18n.t('text_name').toUpperCase()}
                name={userForm.FORM_KEY_NAME}
                component={FormTextInput}
                validate={[validateRequired]}
                keyboardType="default"
                returnKeyType="next"
              /> */}
             <View style={[form.formSegment2, styles.userInfo]}>
                <View style={form.formTextInputWrapper}> 
                  <Text style={form.formTextLabel}>{I18n.t('text_user_name')}</Text>
                  <Text style={form.formTextInput}>{user.username}</Text>
                </View>
                <View style={form.formTextInputWrapper}>
                  <Text style={form.formTextLabel}>{I18n.t('text_email')}</Text>
                  <Text style={form.formTextInput}>{user.email}</Text>
                </View>
              </View>
              {/*<TextButton
                style={styles.saveButton}
                textStyle={styles.saveButtonText}
                isLoading={this.state.isLoading}
                onPress={this.props.handleSubmit(this.onSubmit)}
                disabled={isSaveDisabled}>
                {I18n.t('caption_save')}
              </TextButton>*/}
            <View style={[form.lastFormSegment]}>
              <TextButton
                  style={[button.secondary, button.fullWidth, styles.saveButton]}
                  textStyle={button.secondaryText}
                  onPress={this.deleteUserDataAlert}>
                LOG OUT
              </TextButton>
            </View>
          </View>
          </LinearGradient>
        </ScrollContentView>
      </ImageBackground>
    )
  }

  // protected updateUserData = async (updatedProps: any) => {
  //   try {
  //     await this.setState({ isLoading: true })
  //     await this.props.updateUser({ ...this.props.user, ...updatedProps } as User)
  //   } catch (err) {
  //     Alert.alert(getErrorDisplayMessage(err))
  //   } finally {
  //     this.setState({ isLoading: false })
  //   }
  // }

  // protected onSubmit = async (values: any) => {
  //   this.updateUserData({ fullName: values[userForm.FORM_KEY_NAME] })
  // }

  protected deleteUserDataAlert = () => {
    Alert.alert(
        I18n.t('user_profile_alert_label'),
        I18n.t('user_profile_alert_text'), [
          {
            text: I18n.t('caption_cancel'),
            onPress: () => Logger.debug('Cancel Pressed'),
            style: 'cancel',
          },
          { text: I18n.t('caption_ok'),
            onPress: () => {
              this.props.logout()
              this.props.navigation.reset({ index: 1, routes: [{ name: Screens.FirstContact }]})
            },
          },
        ],
        { cancelable: false },
    )
  }

  // private formIsSaveable() {
  //   const { formFullName } = this.props
  //   const hasName = !isEmpty(formFullName)

  //   return hasName
  // }

  // private formHasChanges() {
  //   const { user, formFullName } = this.props

  //   const nameHasChanged = isEmpty(user.fullName) || formFullName !== user.fullName

  //   return nameHasChanged
  // }
}

const mapStateToProps = (state: any) => {
  const user = getUserInfo(state) || {}
  return {
    user,
    formFullName: getFormFieldValue(userForm.USER_FORM_NAME, userForm.FORM_KEY_NAME)(state),
    initialValues: { [userForm.FORM_KEY_NAME]: user.fullName },
  }
}

export default connect(
  mapStateToProps,
  { logout, fetchUserInfo, updateUser },
)(reduxForm<{}, Props>({
  form: userForm.USER_FORM_NAME,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(UserProfile))
