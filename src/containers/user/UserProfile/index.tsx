import React from 'react'
import { View, ViewProps } from 'react-native'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Images from '@assets/Images'
import * as userForm from 'forms/user'
import { validateRequired } from 'forms/validators'
import I18n from 'i18n'
import User from 'models/User'
import { navigateToUserRegistration } from 'navigation'

import FormImagePicker from 'components/form/FormImagePicker'
import FormTextInput from 'components/form/FormTextInput'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import { button, container, input, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'


class UserProfile extends React.Component<ViewProps & {
  user: User,
}> {


  public render() {
    const { user } = this.props

    // TODO: remove register button
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
          >
            {I18n.t('caption_accept')}
          </TextButton>
          <TextButton
            style={{ padding: 20 }}
            onPress={navigateToUserRegistration}
          >
            REGISTER
          </TextButton>
        </View>
      </ScrollContentView>
    )
  }

  protected renderField(props: any) {
    return <FormTextInput {...props}/>
  }
}

const mapStateToProps = (state: any, props: any) => {
  const user = { name: 'Mock User', nationality: 'German', email: 'mock@user.com' } as User
  return {
    user,
    initialValues: {
      [userForm.FORM_KEY_NAME]: user.name,
    },
  }
}

export default connect(mapStateToProps)(reduxForm({
  form: userForm.USER_FORM_NAME,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})((props: any) => <UserProfile {...props}/>))
