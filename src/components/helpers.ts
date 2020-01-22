import { not } from 'ramda'
import { nothingAsClass, recomposeBranch as branch } from './fp/component'
import { getStore } from 'store'
import { canUpdateCurrentEvent } from 'selectors/permissions'

export const nothingIfCannotUpdateCurrentEvent =
  branch(() => not(canUpdateCurrentEvent(getStore().getState())), nothingAsClass)

export const nothingIfCanUpdateCurrentEvent =
  branch(() => canUpdateCurrentEvent(getStore().getState()), nothingAsClass)
