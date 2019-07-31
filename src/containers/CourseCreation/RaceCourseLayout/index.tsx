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
import CourseConfig from '../CourseConfig'

import { getCourseLoading, getSelectedCourseWithMarks } from 'selectors/course'

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const nothingIfLoading = branch(isLoading, nothingAsClass)
const nothingIfNotLoading = branch(isNotLoading, nothingAsClass)

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
    nothingIfLoading(CourseConfig),
  ]),
)
