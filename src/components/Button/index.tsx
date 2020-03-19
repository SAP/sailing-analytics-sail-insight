import React from 'react'
import BaseButton from 'components/base/BaseButton'

class Button extends BaseButton<{} > {
  public renderContent = () => {
    const {
      children,
    } = this.props
    return (
      <>
        {children}
      </>
    )
  }
}


export default Button
