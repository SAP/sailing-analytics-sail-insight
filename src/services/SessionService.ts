import { includes, intersection, isEmpty, isString } from 'lodash'

import {
  FORM_KEY_BOAT_NAME,
  FORM_KEY_NAME,
  FORM_KEY_PRIVACY_SETTING,
  FORM_KEY_SAIL_NUMBER,
  FORM_KEY_TEAM_NAME,
  FORM_KEY_TRACK_NAME,
} from 'forms/session'
import { TrackingSession } from 'models'


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
  return {
    name: 'My Session 01',
    trackName: 'myTracking',
    sailNumber: '123',
    boatName: 'TEST123',
    teamName: 'Sail Team No.1',
    privacySetting: 'public',
  } as TrackingSession
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

export const formValuesToSession = (values: any) => values && ({
  name: values[FORM_KEY_NAME],
  trackName: values[FORM_KEY_TRACK_NAME],
  boatName: values[FORM_KEY_BOAT_NAME],
  sailNumber: values[FORM_KEY_SAIL_NUMBER],
  teamName: values[FORM_KEY_TEAM_NAME],
  privacySetting: values[FORM_KEY_PRIVACY_SETTING],
} as TrackingSession)
