import React from 'react'
import { HeaderBackButton } from '@react-navigation/stack'

export default (props = {}) => () => (
  <HeaderBackButton
    tintColor='white'
    labelVisible={false}
    {...props}
  />
)
