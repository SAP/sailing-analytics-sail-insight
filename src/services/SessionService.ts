import { includes, intersection, isEmpty, isString } from 'lodash'

import { Session } from 'models'


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
