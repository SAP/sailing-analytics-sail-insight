import { Text, View, Image, TouchableHighlight, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { compose, objOf, merge, always, curry, when, __, has, head, mergeLeft } from 'ramda';
import { fromClass, fold, Component, contramap } from './component';

import Svg from 'react-native-svg'

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
export const text = buildComponentWithChildren(Text)
export const svg = buildComponentWithChildren(Svg)

export const image = (settings: Object) => Component((props: Object) => compose(
  fold(props),
  fromClass(Image).contramap,
  always)(
  settings));

export const touchableHighlight = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(TouchableHighlight).contramap,
  always,
  merge(__, { onPress: () => settings.onPress(props) }),
  merge(settings),
  objOf('children'),
  head,
  when(has('fold'), fold(props)))(
  c)));

export const touchableOpacity = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(TouchableOpacity).contramap,
  always,
  merge(__, { onPress: () => settings.onPress ? settings.onPress(props) : props.onPress(props) }),
  merge(settings),
  objOf('children'),
  head,
  when(has('fold'), fold(props)))(
  c)));

export const forwardingPropsFlatList = Component((props: any) =>
  compose(
    fold(props),
    contramap(mergeLeft({
      renderItem: item => props.renderItem({...props, ...item })
    })))(
  fromClass(FlatList)))
