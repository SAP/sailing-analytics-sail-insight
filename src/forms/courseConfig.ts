export const COURSE_CONFIG_FORM_NAME = 'courseConfig'

export const FORM_ROUNDING_DIRECTION = 'roundingDirection'
export const FORM_LOCATION = 'location'

export const courseConfigCommonFormSettings = {
  form: COURSE_CONFIG_FORM_NAME,
  destroyOnUnmount: false,        // <-- preserve form data across different steps
  forceUnregisterOnUnmount: false,
  keepDirtyOnReinitialize: true,
  enableReinitialize: true
}

const initalLocation = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 1,
  longitudeDelta: 1,
}

export const initialValues = {
  [FORM_LOCATION]: initalLocation,
}
