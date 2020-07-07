import React from 'react'
import TextButton from 'components/TextButton'

import { button } from 'styles/commons'
import I18n from 'i18n'


export const HeaderTextButton = (props = {}) => () => (
  <TextButton 
    textStyle={button.headerTextButton} 
    {...props}
  >
      {props.children}
  </TextButton>
)

export const HeaderCancelTextButton = (props = {}) => () => (
  <TextButton 
    textStyle={button.headerTextButton} 
    {...props}
  >
      {I18n.t('caption_cancel')}
  </TextButton>
)

export const HeaderSaveTextButton = (props = {}) => () => (
  <TextButton 
    textStyle={button.headerTextButton} 
    {...props}
  >
      {I18n.t('caption_save')}
  </TextButton>
)