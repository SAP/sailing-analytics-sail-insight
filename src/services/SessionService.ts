import { includes, intersection, isEmpty, isString } from 'lodash'

import {
  FORM_KEY_BOAT_NAME,
  FORM_KEY_NAME,
  FORM_KEY_PRIVACY_SETTING,
  FORM_KEY_SAIL_NUMBER,
  FORM_KEY_TEAM_NAME,
  FORM_KEY_TRACK_NAME,
} from 'forms/session'
import { Session } from 'models'


export class SessionException extends Error {
  public static NAME: string = 'SessionException'

  constructor(message: string) {
    super(message)
    this.message = message
    this.name = SessionException.NAME
  }
}

export const generateNewSession = (/*add params*/) => {
  // TODO: implement
  return new Session(
    'My Session 01',
    'myTracking',
    '123',
    'TEST123',
    'Sail Team No.1',
    'public',
  )
}

export const getEventImageUrl = (event: any, tag?: string | string[]) => {
  if (!event || !event.images) {
    return null
  }
  for (const image of event.images) {
    const tagDetected = !tag || (isString(tag) ? includes(image.tags, tag) : !isEmpty(intersection(image.tags, tag)))
    if (image && tagDetected) {
      return image.sourceURL
    }
  }
}

export const getEventPreviewImageUrl = (event: any) => getEventImageUrl(event, ['Teaser', 'Stage'])

export const getEventLogoImageUrl = (event: any) => getEventImageUrl(event, 'Logo')

export const formValuesToSession = (values: any) => values && new Session(
  values[FORM_KEY_NAME],
  values[FORM_KEY_TRACK_NAME],
  values[FORM_KEY_BOAT_NAME],
  values[FORM_KEY_SAIL_NUMBER],
  values[FORM_KEY_TEAM_NAME],
  values[FORM_KEY_PRIVACY_SETTING],
)
