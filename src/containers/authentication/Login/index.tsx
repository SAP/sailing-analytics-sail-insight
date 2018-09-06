import React from 'react'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { FORM_KEY_EMAIL, FORM_KEY_PASSWORD } from 'forms/registration'
import I18n from 'i18n'
import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $containerFixedMargin } from 'styles/dimensions'
import styles from './styles'

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'


class Login extends React.Component<{
  navigation: any,
  valid?: boolean,
  isStepValid: boolean,
} > {
  public inputs: any = {}

  public state = {
    email: '',
    password: '',
  }

  public onSubmit = () => {
    const { email, password } = this.state
    if (!email || !password) {
      return
    }
    // TODO: login request and actions
  }

  public handleInputRef = (name: string) => (ref: any) => {
    this.inputs[name] = ref
  }

  public handleOnSubmit = (nextName: string) => () => {
    const nextInput = this.inputs[nextName]
    return nextInput && nextInput.focus && nextInput.focus()
  }

  public onEmailChange = (newValue: string) => this.setState({ email: newValue })
  public onPasswordChange = (newValue: string) => this.setState({ password: newValue })

  public render() {
    return (
      <ScrollContentView
        extraHeight={$containerFixedMargin * 3}
      >
        <View style={container.stretchContent}>
          <Image style={image.headerMedium} source={Images.header.sailors}/>
          <Image style={image.tagLine} source={Images.corporateIdentity.sapTagLine}/>
          <View style={[registration.topContainer(), styles.textContainer]}>
            <Text style={registration.claim()}>
              <Text>{I18n.t('text_login_claim_01')}</Text>
              <Text style={text.claimHighlighted}>{I18n.t('text_login_claim_02')}</Text>
            </Text>
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <TextInput
            value={this.state.email}
            onChangeText={this.onEmailChange}
            placeholder={I18n.t('text_placeholder_your_email')}
            keyboardType={'email-address'}
            returnKeyType="next"
            onSubmitEditing={this.handleOnSubmit(FORM_KEY_PASSWORD)}
            inputRef={this.handleInputRef(FORM_KEY_EMAIL)}
          />
          <TextInput
            value={this.state.password}
            onChangeText={this.onPasswordChange}
            style={styles.password}
            placeholder={I18n.t('text_placeholder_enter_password')}
            keyboardType={'default'}
            returnKeyType="go"
            onSubmitEditing={this.onSubmit}
            secureTextEntry={true}
            inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
          />
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onSubmit}
          >
            {I18n.t('caption_lets_go')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
}

export default connect()(Login)
