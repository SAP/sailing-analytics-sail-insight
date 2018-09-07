import React from 'react'

class TextInputForm<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {

  protected inputs: any = {}

  protected handleOnSubmit = (nextName: string) => () => {
    const nextInput = this.inputs[nextName]
    return nextInput && nextInput.focus && nextInput.focus()
  }

  protected handleInputRef = (name: string) => (ref: any) => {
    this.inputs[name] = ref
  }
}

export default TextInputForm
