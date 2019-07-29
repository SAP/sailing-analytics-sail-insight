import { __, complement, compose, concat, propEq, reduce } from 'ramda'

import {
  Component,
  fold,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  reduxConnect as connect,
} from 'components/fp/component'
import { text } from 'components/fp/react-native'

import { getCourseLoading, getSelectedCourseWithMarks } from 'selectors/race'

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const nothingIfLoading = branch(isLoading, nothingAsClass)
const nothingIfNotLoading = branch(isNotLoading, nothingAsClass)

const course = Component((props: any) =>
  fold(props, text({}, props.course && JSON.stringify(props.course) || 'error')))

const spinner = text({}, 'Loading ...')

const mapStateToProps = (state: any) => ({
  course: getSelectedCourseWithMarks(state),
  loading: getCourseLoading(state),
})

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps),
    reduce(concat, nothing()),
  )([
    nothingIfNotLoading(spinner),
    nothingIfLoading(course),
  ]),
)
