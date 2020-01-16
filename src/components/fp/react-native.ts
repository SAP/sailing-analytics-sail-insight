import { useActionSheet as rnUseActionSheet } from '@expo/react-native-action-sheet'
import IconText from 'components/IconText'
import { __, always, compose, concat, curry, has, head, merge, mergeLeft, objOf, reduce, when } from 'ramda'
import { useState as reactUseState } from 'react'
import { FlatList, Image, KeyboardAvoidingView, ScrollView, Text,
  TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { G, Path, Svg, Text as rnSvgText } from 'react-native-svg'
import { Component, contramap, fold, fromClass, nothing } from './component'

const buildComponentWithChildren = curry((Comp, settings, c) =>
  Component((props: Object) =>
    compose(
      fold(props),
      fromClass(Comp).contramap,
      always,
      merge(settings),
      objOf('children'),
      when(has('fold'), fold(props))
    )(c)))

export const view = buildComponentWithChildren(View)
export const scrollView = buildComponentWithChildren(ScrollView)
export const keyboardAvoidingView = buildComponentWithChildren(KeyboardAvoidingView)
export const text = buildComponentWithChildren(Text)
export const svg = buildComponentWithChildren(Svg)
export const svgPath = fromClass(Path)
export const svgGroup = buildComponentWithChildren(G)
export const svgText = buildComponentWithChildren(rnSvgText)
export const iconText = buildComponentWithChildren(IconText)

export const image = (settings: Object) => Component((props: Object) => compose(
  fold(props),
  fromClass(Image).contramap,
  always)(
  settings))

export const touchableHighlight = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(TouchableHighlight).contramap,
  always,
  merge(__, { onPress: () => settings.onPress(props) }),
  merge(settings),
  objOf('children'),
  head,
  when(has('fold'), fold(props)))(
  c)))

export const touchableOpacity = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(TouchableOpacity).contramap,
  always,
  merge(__, { onPress: () => settings.onPress ? settings.onPress(props) : props.onPress(props) }),
  merge(settings),
  objOf('children'),
  head,
  when(has('fold'), fold(props)))(
  c)))

export const forwardingPropsFlatList = Component((props: any) =>
  compose(
    fold(props),
    contramap(mergeLeft({
      renderItem: item => props.renderItem({...props, ...item })
    })))(
  fromClass(FlatList)))

export const useActionSheet = () => c => {
  const { showActionSheetWithOptions } = rnUseActionSheet();

  return c.contramap(merge({
    showActionSheetWithOptions
  }))
}

export const useState = (name, updateFn, initialValue) => c => {
  const [value, updater] = reactUseState(initialValue)

  return c.contramap(merge(__, {
    [name]:     value,
    [updateFn]: updater
  }))
}

export const inlineText = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  text(merge({ style: { flexDirection: 'row' } }, settings)),
  reduce(concat, nothing()),
  )(c)))
