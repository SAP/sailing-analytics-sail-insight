import { __, compose, concat, head, mergeLeft, objOf, reduce } from 'ramda'

import MapView, { Marker } from 'react-native-maps'

import {
  Component,
  contramap,
  fold,
  fromClass,
  nothing,
} from 'components/fp/component'
import { view } from 'components/fp/react-native'
import { field as reduxFormField, reduxForm } from 'components/fp/redux-form'
import TextInput from 'components/TextInput'

import { courseConfigCommonFormSettings, FORM_LOCATION } from 'forms/courseConfig'

import styles from './styles'

const marker = Component((props: any) => compose(
  fold(props),
  contramap(mergeLeft({
    coordinate: props.input.value,
  })),
)(fromClass(Marker)))

const mapView = (settings: any = {}) => Component((props: any) => compose(
    fold(props),
    view({ style: styles.mapContainer }),
    fromClass(MapView).contramap,
    mergeLeft,
    mergeLeft({
      ...settings,
      region: props.input.value,
      onRegionChange: (region: any) => {
        props.input.onChange(region)
      },
    }),
    objOf('children'),
    head,
    fold(props),
  )(marker),
)

const mapField = (settings: any = {}) => reduxFormField({
  name: FORM_LOCATION,
  component: mapView(settings).fold,
})

const COORDS_PRECISION = 7
const coordinatesInput = ({ propName }: any) => Component((props: any) => compose(
    fold(props),
    contramap(mergeLeft({
      // value: props.region[propName].toPrecision(COORDS_PRECISION).toString(),
      value: props.input.value[propName].toString(),
      onChangeText: (value: any) => props.input.onChange({
        ...props.input.value,
        [propName]: parseFloat(value),
      }),
      placeholder: propName,
    })),
  )(fromClass(TextInput)),
)

const coordinatesInputField = (...args: any[]) => reduxFormField({
  name: FORM_LOCATION,
  component: coordinatesInput(...args).fold
})

const latitudeInput = coordinatesInputField({ propName: 'latitude' })
const longitudeInput = coordinatesInputField({ propName: 'longitude' })

export default Component((props: object) =>
  compose(
    fold(props),
    reduxForm(courseConfigCommonFormSettings),
    reduce(concat, nothing()),
  )([
    mapField({
      style: styles.map,
    }),
    latitudeInput,
    longitudeInput,
  ]),
)
