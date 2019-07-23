import { Text, View, Image, TouchableHighlight, TouchableOpacity, FlatList } from 'react-native';
import { compose, objOf, merge, always, curry, when, __, has, head, mergeLeft } from 'ramda';
import { fromClass, fold, Component, contramap } from './component';

export const view = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(View).contramap,
  always,
  merge(settings),
  objOf('children'),
  fold(props))(
  c)));

export const text = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(Text).contramap,
  always,
  merge(settings),
  objOf('children'),
  when(has('fold'), fold(props)))(
  c)));

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
  fold(props))(
  c)));

export const touchableOpacity = curry((settings, c) => Component((props: Object) => compose(
  fold(props),
  fromClass(TouchableOpacity).contramap,
  always,
  merge(__, { onPress: () => settings.onPress ? settings.onPress(props) : props.onPress(props) }),
  merge(settings),
  objOf('children'),
  head,
  fold(props))(
  c)));

export const forwardingPropsFlatList = Component((props: any) =>
  compose(
    fold(props),
    contramap(mergeLeft({
      renderItem: item => props.renderItem({...props, ...item })
    })))(
  fromClass(FlatList)))
