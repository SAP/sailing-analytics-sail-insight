import { compose, always, curry, merge, __, when, head, objOf, has } from 'ramda'
import { fromClass, fold, Component, enhance } from './component'
import { reduxForm as nativeReduxForm, FormSection } from 'redux-form'

import { view } from './react-native'

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
    merge(settings),
    objOf('children'),
    head,
    when(has('fold'), fold(props)),
    view({}))(
    c)))

export {
    field,
    reduxForm,
    formSection
}
