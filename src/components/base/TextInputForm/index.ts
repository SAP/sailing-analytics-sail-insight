import React from 'react'
import { InjectedFormProps } from 'redux-form'

interface Props {
  valid?: boolean,
  isStepValid?: boolean,
}

class TextInputForm<P = {}, S = {}, SS = any> extends React.Component<
  P & Props & InjectedFormProps<{}, P & Props>,
  S,
  SS
> {

  protected inputs: any = {}

  protected handleOnSubmitInput = (nextName: string) => () => {
    const nextInput = this.inputs[nextName]
    return nextInput && nextInput.focus && nextInput.focus()
  }

  protected handleInputRef = (name: string) => (ref: any) => {
    this.inputs[name] = ref
  }
}

export default TextInputForm
