import { compose, merge } from 'ramda'

import { Component, contramap, fold, fromClass } from 'components/fp/component'
import { text, touchableOpacity } from 'components/fp/react-native'
import IconText from 'components/IconText'

import Images from '@assets/Images'
import { navigateToMain } from 'navigation'

export const nextButton = (onPress: any, label: string) =>
  Component((props: any) =>
    compose(
      fold(props),
      touchableOpacity({ onPress }),
      contramap(merge({
        source: Images.actions.arrowRight,
        alignment: 'horizontal',
        iconPosition: 'second',
        children: label,
      })))
    (fromClass(IconText)))


export const reviewButton = Component((props: object) => compose(
  fold(props),
  touchableOpacity({
    onPress: navigateToMain,
    style: {
      backgroundColor: '#1897FE',
      marginHorizontal: '5%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }),
  text({ style: { color: '#FFFFFF' }}))(
  'Review and create'))
