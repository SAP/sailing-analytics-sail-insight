import React, { Component } from 'react'
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native'

import I18n from 'i18n'

import Text from 'components/Text'

import TitleLabel from '../TitleLabel'
import styles from './styles'


class EditItem extends React.Component<ViewProps & {
  title: string,
  titleStyle: StyleProp<TextStyle>
  onEdit?: () => void,
  renderEditControl?: () => Component | Element | JSX.Element,
} > {

  public render() {
    const {
      title,
      children,
      style,
      titleStyle,
    } = this.props

    return (
      <View style={[styles.container, style]}>
        <TitleLabel style={styles.title} titleStyle={titleStyle} title={title}>
          {children}
        </TitleLabel>
        {this.renderEditView()}
      </View>
    )
  }

  protected renderEditView() {
    const {
      onEdit,
      renderEditControl,
    } = this.props

    if (!onEdit && !renderEditControl) {
      return null
    }

    const renderedView = renderEditControl ? renderEditControl() : <Text>{I18n.t('caption_edit')}</Text>
    return onEdit ? (
        <TouchableOpacity onPress={onEdit}>
          {renderedView}
        </TouchableOpacity>
      ) : (
        <View>
          {renderedView}
        </View>
      )
  }
}

export default EditItem
