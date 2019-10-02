import { __, compose, always, both, path, when, append, zipWith,
    prop, map, reduce, concat, merge, props as rProps, defaultTo,
    objOf, isNil, not, either, equals, pick, tap, ifElse, insert, reverse,
    propEq, addIndex, mergeLeft, intersperse, gt, findIndex } from 'ramda'
  
  import {
    Component,
    fold,
    fromClass,
    nothing,
    nothingAsClass,
    reduxConnect as connect,
    recomposeBranch as branch,
    recomposeWithState as withState,
    recomposeMapProps as mapProps
  } from 'components/fp/component'
  import { text, view, scrollView, touchableOpacity } from 'components/fp/react-native'

export default Component((props: object) =>
  compose(
    fold(props),
    view({}),
    text({}))(
    'mark inventory'))