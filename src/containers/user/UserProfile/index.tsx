import { isEmpty } from 'lodash'
import React from 'react'
import { Alert, View } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import { fetchCurrentUser, removeAuthInfo, updateUser } from 'actions/auth'
import * as userForm from 'forms/user'
import { validateRequired } from 'forms/validators'
import { getUnknownErrorMessage } from 'helpers/texts'
import I18n from 'i18n'
import User from 'models/User'

import TextInputForm from 'components/base/TextInputForm'
import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { getUserInfo } from 'selectors/auth'
import { getFormFieldValue } from 'selectors/form'
import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'


interface Props {
  user: User,
  formFullName?: string,
  removeAuthInfo: () => void,
  fetchCurrentUser: () => void,
  updateUser: (u: User) => void,
}

class UserProfile extends TextInputForm<Props> {

  public state = {
    isLoading: false,
  }

  // TODO: remove logout button
  public componentDidMount() {
    this.props.fetchCurrentUser()
  }

  public render() {
    const { user, formFullName } = this.props
    const isSaveDisabled = isEmpty(formFullName) || (!isEmpty(user.fullName) && formFullName === user.fullName)
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Field
            name={userForm.FORM_KEY_IMAGE}
            component={FormImagePicker}
            placeholder={Images.header.sailors}
          />
          <View style={container.mediumHorizontalMargin}>
            <Field
              style={input.topMargin}
              label={I18n.t('text_your_name')}
              name={userForm.FORM_KEY_NAME}
              component={this.renderField}
              validate={[validateRequired]}
              keyboardType="default"
              returnKeyType="next"
            />
            <Text style={[text.propertyValue, input.topMargin]}>{user.email}</Text>
            <Text style={[text.propertyValue, input.topMargin]}>{user.nationality}</Text>
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            isLoading={this.state.isLoading}
            onPress={this.props.handleSubmit(this.onSubmit)}
            disabled={isSaveDisabled}
          >
            {I18n.t('caption_save')}
          </TextButton>
          <TextButton
            style={{ padding: 20 }}
            onPress={this.props.removeAuthInfo}
          >
            Log out
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }

  protected onSubmit = async (values: any) => {
    try {
      await this.setState({ isLoading: true })
      await this.props.updateUser({ ...this.props.user, fullName: values[userForm.FORM_KEY_NAME] } as User)
    } catch (err) {
      Alert.alert(getUnknownErrorMessage())
    } finally {
      this.setState({ isLoading: false })
    }
  }

  protected renderField(props: any) {
    return <FormTextInput {...props}/>
  }
}

const mapStateToProps = (state: any) => {
  const user = getUserInfo(state) || {}
  return {
    user,
    formFullName: getFormFieldValue(userForm.USER_FORM_NAME, userForm.FORM_KEY_NAME)(state),
    initialValues: {
      [userForm.FORM_KEY_NAME]: user.fullName,
    },
  }
}

export default connect(
  mapStateToProps,
  { removeAuthInfo, fetchCurrentUser, updateUser },
)(reduxForm<{}, Props>({
  form: userForm.USER_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
})(UserProfile))
