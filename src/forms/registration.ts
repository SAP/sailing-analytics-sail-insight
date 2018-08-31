export const REGISTRATION_FORM_NAME = 'registration'

export const FORM_KEY_NAME = 'name'
export const FORM_KEY_EMAIL = 'email'
export const FORM_KEY_PASSWORD = 'password'
export const FORM_KEY_BOAT_NAME = 'boatName'
export const FORM_KEY_BOAT_CLASS = 'boatClass'
export const FORM_KEY_SAIL_NUMBER = 'sailNumber'

const requiredValues = [
  FORM_KEY_EMAIL,
  FORM_KEY_PASSWORD,
  FORM_KEY_NAME,
]


export const validateRegistration = (values: any = {}) => {
  const errors: any = {}

  requiredValues.forEach((element: string) => {
    if (!values[element]) { errors[element] = {} }
  })

  return errors
}
