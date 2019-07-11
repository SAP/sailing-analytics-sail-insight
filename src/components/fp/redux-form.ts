import { compose, always } from 'ramda';
import { fromClass, fold, Component, enhance } from './component';
import { reduxForm as nativeReduxForm } from 'redux-form';

import { Field } from 'redux-form'

const reduxForm = enhance(nativeReduxForm);

const field = (settings: Object) => Component((props: Object) => compose(
    fold(props),
    fromClass(Field).contramap,
    always)(
    settings));

export {
    field,
    reduxForm
};
