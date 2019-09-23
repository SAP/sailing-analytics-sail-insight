import React from 'react';
import {
    compose, curry, reject, isNil, always, prop, __, addIndex, map
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

const mapIndexed = addIndex(map)

const fold    = curry((props, v) => v.fold(props));
const asArray = (x: any) => Array.isArray(x) ? x : [x];

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
            mapIndexed((element, i) => React.cloneElement(element, { key: i })),
            reject(isNil),
            g)
    }),
    (x: any) => compose(asArray, x)
);

const contramap = curry((f: Function, c: any) => c.contramap(f))

// of :: JSX -> Component
Component.of = compose(Component, always);

const fromClass   = compose(Component, classToFn);
const nothing     = () => Component.of(null);


const nothingAsClass = () => class extends React.Component {
    render() { return null; }
};

export {
    Component,
    contramap,
    fold,
    classToFn,
    enhance,
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
