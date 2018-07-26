import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import { checkIn } from 'actions/checkIn'
import GradientContainer from 'components/GradientContainer'
import { container } from 'styles/commons'

import styles from './styles'


class CheckIn extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
  }

  onSuccess = (qr) => {
    this.props.checkIn(qr?.data)
  }

  render() {
    return (
      <GradientContainer style={container.main}>
        <View />
      </GradientContainer>
    )
  }
}

export default connect(null, { checkIn })(CheckIn)
