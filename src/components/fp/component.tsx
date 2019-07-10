import React from 'react';
import {
    compose, curry, reject, isNil, always, prop, __
} from 'ramda';
import {
    branch,
    withHandlers,
    withState,
    withStateHandlers,
    mapProps,
    defaultProps,
    withProps,
    lifecycle
} from 'recompose';
import { connect } from 'react-redux';

const fold    = curry((props, v) => v.fold(props));
const asArray = (x: any) => Array.isArray(x) ? x : Array.of(x);

const classToFn = (C: any) => (props: any) => <C {...props}/>;

const enhance = (fn: any) => (...args: any[]) => compose(
    Component,
    classToFn,
    fn(...args),
    prop('fold'));

const reduxConnect               = enhance(connect);
const recomposeBranch            = enhance(branch);
const recomposeWithHandlers      = enhance(withHandlers);
const recomposeWithState         = enhance(withState);
const recomposeWithStateHandlers = enhance(withStateHandlers);
const recomposeMapProps          = enhance(mapProps);
const recomposeDefaultProps      = enhance(defaultProps);
const recomposeWithProps         = enhance(withProps);
const recomposeLifecycle         = enhance(lifecycle);

const Component = compose(
    (g: Function) => ({
        g,
        map:       (f: Function) => Component((x: any) => f(g(x), x)),
        contramap: (f: Function) => Component((x: any) => g(f(x))),
        concat:    (other: any) => Component((x: any) => g(x).concat(other.g(x))),
        // fold :: props -> JSX
        fold:      compose(
            reject(isNil),
            g)
    }),
    (x: any) => compose(asArray, x)
);

// of :: JSX -> Component
Component.of = compose(Component, always);

const fromClass   = compose(Component, classToFn);
const nothing     = () => Component.of(null);


const nothingAsClass = () => class extends React.Component {
    render() { return null; }
};

export {
    Component,
    fold,
    classToFn,
    reduxConnect,
    recomposeBranch,
    recomposeWithHandlers,
    recomposeWithState,
    recomposeWithStateHandlers,
    recomposeMapProps,
    recomposeWithProps,
    recomposeDefaultProps,
    recomposeLifecycle,
    nothing,
    nothingAsClass,
    fromClass
};
