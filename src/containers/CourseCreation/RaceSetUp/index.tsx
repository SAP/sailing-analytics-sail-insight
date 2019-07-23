import { __, compose, concat, mergeLeft, reduce } from 'ramda'

import DatePicker from 'react-native-datepicker'
import Carousel from 'react-native-snap-carousel'

import {
  Component,
  fold,
  fromClass,
  nothing,
  recomposeWithState as withState
} from 'components/fp/component'
import { text, view } from 'components/fp/react-native'

import Images from '@assets/Images'
import styles, { itemWidth, sliderWidth } from './styles'

const dateToTime = (date: Date) => `${date.getHours()}:${date.getMinutes()}`

const courseLayouts = [
  { id: '0', title: 'FOO', image: null },
  { id: '1', title: 'BAR', image: null },
  { id: '2', title: 'BAZ', image: null },
]

const withSelectedLayout = withState('selectedLayout', 'setSelectedLayout', 0)
const withStartTime = withState('startTime', 'setStartTime', dateToTime(new Date()))

const timePicker = fromClass(DatePicker).contramap((props: any) =>
  mergeLeft({
    mode: 'time',
    iconSource: Images.info.time,
    date: props.startTime,
    onDateChange: (val: any) => props.setStartTime(val),
  }, props),
)

const carouselItem = Component((props: any) =>
  compose(
    fold(props),
    view({ style: styles.slideInnerContainer }),
    reduce(concat, nothing()),
  )([
    view({ style: styles.slideImageContainer }, nothing()),
    view({ style: styles.slideTextContainer }, text({}, props.item.title)),
  ]),
)

const carousel = fromClass(Carousel).contramap((props: any) =>
  mergeLeft({
    sliderWidth,
    itemWidth,
    data: courseLayouts,
    renderItem: carouselItem.fold,
    onSnapToItem: (index: number) => props.setSelectedLayout(index),
  }, props),
)

const selectedLayout = Component((props: any) => compose(
  fold(props),
)(text({}, props.selectedLayout)))

export default Component((props: object) =>
  compose(
    fold(props),
    withSelectedLayout,
    withStartTime,
    view({ style: styles.screenContainer }),
    reduce(concat, nothing()),
  )([
    text({}, 'Start time'),
    timePicker,
    text({}, 'Select Course layout'),
    carousel,
    selectedLayout,
  ]),
)
