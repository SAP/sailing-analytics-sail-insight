import { includes, intersection, isEmpty, isString } from 'lodash'

import { dateTimeText } from 'helpers/date'
import I18n from 'i18n'
import { BoatTemplate, TrackingSession, User } from 'models'


const getUserSessionPrefix = (username: string) => `<${username}>`

export const generateNewSession = (boat?: BoatTemplate) => {
  // TODO: implement prefill from current boat
  return {
    name: generateNewSessionName(),
    trackName: generateNewTrackName(),
    teamName: I18n.t('text_default_value_team_name'),
    privacySetting: 'public',
    boatClass: (boat && boat.boatClass),
    boatName: (boat && boat.name) || I18n.t('text_default_value_boat_name'),
    sailNumber: (boat && boat.sailNumber) || I18n.t('text_default_value_sail_number'),
    boatId: (boat && boat.id),
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

export const generateNewSessionName = () => `${I18n.t('text_session')} ${dateTimeText(new Date())}`

export const generateNewTrackName = () => I18n.t('text_mock_track_name')

export const removeUserPrefix = (user?: string | User, text?: string) => {
  if (!user || !text) {
    return
  }
  return isString(user) ?
    text.replace(getUserSessionPrefix(user), '').trim() :
    user.username && text.replace(getUserSessionPrefix(user.username), '').trim()

}

export const addUserPrefix = (username: string, text: string) => {
  if (!username && !text) {
    return
  }
  const sessionPrefix = getUserSessionPrefix(username)
  return text.indexOf(sessionPrefix) === 0 ? text : `${sessionPrefix} ${text}`
}
