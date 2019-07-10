import { Text, View, Image, TouchableHighlight } from 'react-native';
import { compose, objOf, merge, always, curry, unless, is, __, either, isNil, head } from 'ramda';
import { fromClass, fold, Component } from './component';

const view = curry((settings, c) => Component((props: Object) => compose(
    fold(props),
    fromClass(View).contramap,
    always,
    merge(settings),
    objOf('children'),
    fold(props))(
    c)));

const text = curry((settings, c) => Component((props: Object) => compose(
    fold(props),
    fromClass(Text).contramap,
    always,
    merge(settings),
    objOf('children'),
    unless(either(is(String), isNil), fold(props)))(
    c)));

const image = (settings: Object) => Component((props: Object) => compose(
    fold(props),
    fromClass(Image).contramap,
    always)(
    settings));

const touchableHighlight = curry((settings, c) => Component((props: Object) => compose(
    fold(props),
    fromClass(TouchableHighlight).contramap,
    always,
    merge(__, { onPress: () => settings.onPress(props) }),
    merge(settings),
    objOf('children'),
    head,
    fold(props))(
    c)));

const touchableOpacity = curry((settings, c) => Component((props: Object) => compose(
    fold(props),
    fromClass(TouchableHighlight).contramap,
    always,
    merge(__, { onPress: () => settings.onPress(props) }),
    merge(settings),
    objOf('children'),
    head,
    fold(props))(
    c)));

export {
    view,
    text,
    image,
    touchableHighlight,
    touchableOpacity
};
