import { includes } from 'lodash'

import Session from 'models/Session'


export const generateNewSession = (/*add params*/) => {
  // TODO: implement
  return new Session(
    'myTracking',
    '123',
    'TEST123',
    'Sail Team No.1',
    'public',
  )
}

export const getEventPreviewImageUrl = (event: any, tag: string = 'Stage') => {
  if (!event || !event.images) {
    return null
  }
  for (const image of event.images) {
    if (image && includes(image.tags, tag)) {
      return image.sourceURL
    }
  }
}
