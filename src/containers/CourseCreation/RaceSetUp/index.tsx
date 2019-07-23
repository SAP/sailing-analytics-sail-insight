import { __, compose, concat, mergeLeft, reduce } from 'ramda'

import DatePicker from 'react-native-datepicker'
import Carousel from 'react-native-snap-carousel'

import {
  Component,
  fold,
  fromClass,
  nothing,
} from 'components/fp/component'
import { text, view } from 'components/fp/react-native'

import Images from '@assets/Images'
import styles, { itemWidth, sliderWidth } from './styles'

const timePicker = fromClass(DatePicker).contramap(
  mergeLeft({
    mode: 'time',
    iconSource: Images.info.time,
  }),
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

const courseLayouts = [
  { id: '1', title: 'FOO', image: null },
  { id: '2', title: 'BAR', image: null },
  { id: '3', title: 'BAZ', image: null },
]

const carousel = fromClass(Carousel).contramap(
  mergeLeft({
    sliderWidth,
    itemWidth,
    data: courseLayouts,
    renderItem: carouselItem.fold,
  }),
)

export default Component((props: object) =>
  compose(
    fold(props),
    view({ style: styles.screenContainer }),
    reduce(concat, nothing()),
  )([
    text({}, 'Start time'),
    timePicker,
    text({}, 'Select Course layout'),
    carousel,
  ]),
)
