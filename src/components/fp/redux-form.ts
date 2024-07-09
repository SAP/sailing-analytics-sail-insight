import { compose, always, curry, mergeRight, __, when, head, objOf, has, path, isNil, concat, equals } from 'ramda'
import { fromClass, fold, Component, enhance, nothingAsClass, recomposeBranch as branch } from './component'
import { reduxForm as nativeReduxForm, FormSection } from 'redux-form'

import { TextInput } from 'react-native'
import { view, text } from './react-native'

import { Field } from 'redux-form'

const reduxForm = enhance(nativeReduxForm);

const field = (settings: Object) => Component((props: Object) => compose(
    fold(props),
    fromClass(Field).contramap,
    always)(
    settings))

const formSection = curry((settings, c) => Component((props: Object) => compose(
    fold(props),
    fromClass(FormSection).contramap,
    always,
    mergeRight(settings),
    objOf('children'),
    head,
    when(has('fold'), fold(props)),
    view({}))(
    c)))

const nothingWhenNoError = branch(compose(isNil, path(['meta', 'error'])), nothingAsClass)
const nothingWhenNotTouched = branch(compose(equals(false), path(['meta', 'touched'])), nothingAsClass)

const ErrorText = Component((props: object) => compose(
    fold(props),
    text({ style: { color: 'red', paddingLeft: 5 }}),
    path(['meta', 'error']))(
    props))

const textInputWithMeta = Component((props: object) => compose(
    fold(props),
    view({ style: { flexDirection: 'column', alignItems: 'stretch', flex: 1 }}),
    concat(__, nothingWhenNotTouched(nothingWhenNoError(ErrorText))))(
    fromClass(TextInput)))

export {
    field,
    reduxForm,
    formSection,
    textInputWithMeta
}
