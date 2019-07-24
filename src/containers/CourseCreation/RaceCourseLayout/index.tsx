import { __, compose } from 'ramda'

import {
  Component,
  fold,
  recomposeLifecycle as lifecycle,
} from 'components/fp/component'
import { text } from 'components/fp/react-native'

import { selfTrackingApi } from 'api'

const withCourse = lifecycle({
  state: { course: undefined },
  componentDidMount() {
    selfTrackingApi('https://sapsailing.com').requestCourse(
      'TW 2013 (Finn)', 'Finn Race 4'
    ).then((res: any) => this.setState({ course: JSON.stringify(res)}))
  }
})

const course = Component((props: any) =>
  fold(props, text({}, props.course || 'loading')))

export default Component((props: object) =>
  compose(
    fold(props),
    withCourse,
  )(course),
)
