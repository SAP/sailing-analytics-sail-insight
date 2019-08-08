import { __, complement, compose, concat, propEq, reduce } from 'ramda'

import {
  Component,
  fold,
  nothing,
  nothingAsClass,
  recomposeBranch as branch,
  reduxConnect as connect,
} from 'components/fp/component'
import { text, touchableOpacity } from 'components/fp/react-native'
import CourseConfig from '../CourseConfig'

import { saveCourse, saveWaypointFromForm } from 'actions/courses'
import { getCourseLoading, getSelectedCourseWithMarks } from 'selectors/course'

import { navigateBack } from 'navigation'

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
      onPress: async () => {
        await props.saveCourse()
        navigateBack()
      },
    }),
  )(text({}, 'Save course')),
)

const saveWaypointButton = Component((props: object) =>
  compose(
    fold(props),
    touchableOpacity({ onPress: (props: any) => props.saveWaypointFromForm() }),
    text({}))(
    'Save waypoint'))

export default Component((props: object) =>
  compose(
    fold(props),
    connect(mapStateToProps, { saveCourse, saveWaypointFromForm }),
    reduce(concat, nothing()),
  )([
    nothingIfNotLoading(spinner),
    nothingIfLoading(CourseConfig),
    saveCourseButton,
    saveWaypointButton,
  ]),
)
