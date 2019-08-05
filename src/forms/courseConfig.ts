export const COURSE_CONFIG_FORM_NAME = 'courseConfig'

export const FORM_ROUNDING_DIRECTION = 'roundingDirection'

export const courseConfigCommonFormSettings = {
  form: COURSE_CONFIG_FORM_NAME,
  destroyOnUnmount: false,        // <-- preserve form data across different steps
  forceUnregisterOnUnmount: false,
  keepDirtyOnReinitialize: true,
  enableReinitialize: true
}

export const initialValues = {
  
}