import React from 'react';
import {
  compose, curry, reject, isNil, always, prop,
  __, addIndex, map, mergeRight,
  objOf, when, has, ifElse
} from 'ramda'
import {
    branch,
    withHandlers,
    withState,
    withStateHandlers,
    mapProps,
    defaultProps,
    withProps,
    lifecycle
} from 'recompose'
import { connect } from 'react-redux'
import { connectActionSheet as rnConnectActionSheet } from '@expo/react-native-action-sheet'

const mapIndexed = addIndex(map)

const fold    = curry((props, v) => v.fold(props))
const asArray = (x: any) => Array.isArray(x) ? x : [x]

const classToFn = (C: any) => (props: any) => <C {...props}/>

const ComponentRenderer = ({ props, g }) => compose(
  mapIndexed((e, index) => mergeRight(e, { key: index })),
  reject(isNil),
  g)(
  props)

export const Component = compose(
    g => {
        if (!g || typeof g !== 'function') {
            console.error('Component received invalid g:', g);
            return {
                g: () => [],
                map: () => Component(() => []),
                contramap: () => Component(() => []),
                concat: () => Component(() => []),
                fold: () => null
            };
        }

        return {
            g,
            map:       f => Component(x => f(g(x), x)),
            contramap: f => Component(x => g(f(x))),
            concat:    other => {
                if (!other || !other.g) {
                    console.error('concat received invalid other:', other);
                    return Component(g);
                }
                return Component(x => g(x).concat(other.g(x)));
            },
            fold: ifElse(prop('customRenderer'),
                compose(
                    mapIndexed((e, index) => mergeRight(e, { key: index })),
                    reject(isNil),
                    g),
                props => <ComponentRenderer props={props} g={g}/>)
        };
    },
    x => compose(asArray, x))

const enhance = (fn: any) => (...args: any[]) => compose(
    Component,
    classToFn,
    fn(...args),
    prop('fold'))

const enhanceSimple = (fn: any) => compose(
    Component,
    classToFn,
    fn,
    prop('fold'))

export const buildComponentWithChildren = curry((Comp, settings, c) =>
    Component((props: Object) => compose(
        fold(props),
        fromClass(Comp).contramap,
        always,
        mergeRight(settings),
        objOf('children'),
        when(has('fold'), fold(props)))(
        c)))

const reduxConnect               = enhance(connect)
const recomposeBranch            = enhance(branch)
const recomposeWithHandlers      = enhance(withHandlers)
const recomposeWithState         = enhance(withState)
const recomposeWithStateHandlers = enhance(withStateHandlers)
const recomposeMapProps          = enhance(mapProps)
const recomposeLifecycle         = enhance(lifecycle)
const connectActionSheet         = enhanceSimple(rnConnectActionSheet)

const contramap = curry((f: Function, c: any) => c.contramap(f))

// of :: JSX -> Component
Component.of = compose(Component, always)

const fromClass   = compose(Component, classToFn)
const nothing     = () => Component.of(null)

const nothingAsClass = () => class extends React.Component {
    render() { return null }
}

export {
    Component,
    contramap,
    fold,
    classToFn,
    enhance,
    reduxConnect,
    connectActionSheet,
    recomposeBranch,
    recomposeWithHandlers,
    recomposeWithState,
    recomposeWithStateHandlers,
    recomposeMapProps,
    recomposeLifecycle,
    nothing,
    nothingAsClass,
    fromClass
}
