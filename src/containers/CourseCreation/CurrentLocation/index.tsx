import { __, compose, concat, defaultTo, isNil, path, reduce, unless } from 'ramda'

import {
  Component,
  fold,
  nothing,
  recomposeLifecycle as lifecycle,
} from 'components/fp/component'
import { image, text, view } from 'components/fp/react-native'

import { coordinatesToString } from 'helpers/utils'

import Images from '@assets/Images'

const withCurrentLocation = lifecycle({
  state: { currentLocation: undefined },
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((location: any) =>
      this.setState({ currentLocation: location }),
    )
  },
})

const location = Component((props: any) => compose(
  fold(props),
  view({ style: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FE',
  }}),
  reduce(concat, nothing()),
)([
  image({ source: Images.info.location }),
  text(
    {},
    compose(
      defaultTo('loading'),
      unless(isNil, coordinatesToString),
      path(['currentLocation', 'coords']))(props),
  ),
]))

export default Component((props: object) =>
  compose(
    fold(props),
    withCurrentLocation,
  )(location),
)
