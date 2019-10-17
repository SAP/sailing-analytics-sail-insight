import { __, complement, compose, concat, propEq, reduce, isNil, prop, tap } from 'ramda'

import {
  Component,
  fold,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  reduxConnect as connect,
} from 'components/fp/component'
import { text, touchableOpacity, scrollView } from 'components/fp/react-native'
import CourseConfig from '../CourseConfig'

import { saveCourse } from 'actions/courses'
import { getCourseLoading, getSelectedCourseWithMarks } from 'selectors/course'

import { Alert } from 'react-native'

import { navigateBack } from 'navigation'
import Snackbar from 'react-native-snackbar'

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const nothingIfLoading = branch(isLoading, nothingAsClass)
const nothingIfNotLoading = branch(isNotLoading, nothingAsClass)
const nothingIfNoCourse = branch(compose(isNil, prop('course')), nothingAsClass)

const spinner = text({}, 'Loading ...')

const mapStateToProps = (state: any) => ({
  course: getSelectedCourseWithMarks(state),
  loading: getCourseLoading(state),
})

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { saveCourse }),
    scrollView({ vertical: true, style: { flex: 1 } }),
    reduce(concat, nothing()))([
    nothingIfNotLoading(spinner),
    nothingIfLoading(nothingIfNoCourse(CourseConfig))
  ]),
)
