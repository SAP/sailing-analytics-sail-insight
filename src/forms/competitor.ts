import { CompetitorInfo } from 'models'

import { validateRequired } from './validators'

export const COMPETITOR_FORM_NAME = 'competitor'


export const validate = (values: CompetitorInfo = {}) => {
  const errors: any = {}

  errors.boatClass = validateRequired(values.boatClass)
  errors.boatName = validateRequired(values.boatName)
  // errors.boatId = validateRequired(values.boatId)
  errors.name = validateRequired(values.name)
  errors.sailNumber = validateRequired(values.sailNumber)
  errors.teamName = validateRequired(values.teamName)

  return errors
}
