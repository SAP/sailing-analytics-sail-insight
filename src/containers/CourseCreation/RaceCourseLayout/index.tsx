import { __, complement, compose, concat, propEq, reduce } from 'ramda'

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

import { saveCourse, saveWaypointFromForm } from 'actions/courses'
import { getCourseLoading, getSelectedCourseWithMarks } from 'selectors/course'

import { Alert } from 'react-native'

import { navigateBack } from 'navigation'
import Snackbar from 'react-native-snackbar'

const isLoading = propEq('loading', true)
const isNotLoading = complement(isLoading)
const nothingIfLoading = branch(isLoading, nothingAsClass)
const nothingIfNotLoading = branch(isNotLoading, nothingAsClass)

const spinner = text({}, 'Loading ...')

const mapStateToProps = (state: any) => ({
  course: getSelectedCourseWithMarks(state),
  loading: getCourseLoading(state),
})

const saveCourseButton = Component((props: any) =>
  compose(
    fold(props),
    touchableOpacity({
      onPress: () => {
        Alert.alert(
          'How would you like to save?',
          'You can overwrite the existing course or save a new course.',
          [
            { text: 'Overwrite course', onPress: async () => {
              await props.saveCourse()
              navigateBack()

              Snackbar.show({
                title: 'Course successfully saved',
                duration: Snackbar.LENGTH_LONG
              })
            }},
            { text: 'Save as new course'},
            { text: 'Don\'t save'},
            { text: 'Cancel' }
          ])
      },
    }))(
    text({}, 'Save course')),
)

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { saveCourse, saveWaypointFromForm }),
    scrollView({ vertical: true, style: { flex: 1 } }),
    reduce(concat, nothing()))([
    nothingIfNotLoading(spinner),
    nothingIfLoading(CourseConfig),
    saveCourseButton
  ]),
)
