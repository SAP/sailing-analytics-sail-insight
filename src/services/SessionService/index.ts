import { includes, intersection, isEmpty, isString } from 'lodash'

import { dateTimeText } from 'helpers/date'
import I18n from 'i18n'
import { TeamTemplate, TrackingSession, User } from 'models'
import { RootState } from '../../reducers/config'
import { getDeviceCountryIOC } from '../CheckInService'


const getUserSessionPrefix = (username: string) => `<${username}>`

export const generateNewSession = (team?: TeamTemplate, state: RootState = {}) => {
  // TODO: implement prefill from current boat
  const userName = state.auth.user ? state.auth.user.fullName : null
  return {
    name: generateNewSessionName(),
    trackName: generateNewTrackName(),
    teamName: (team && team.name) || userName || I18n.t('text_default_value_team_name'),
    privacySetting: 'public',
    boatClass: (team && team.boatClass),
    boatName: (team && team.boatName) || I18n.t('text_default_value_boat_name'),
    sailNumber: (team && team.sailNumber) || I18n.t('text_default_value_sail_number'),
    boatId: (team && team.id),
    nationality: (team && team.nationality) || getDeviceCountryIOC(),
    // TODO use image data from team
    teamImage: state.auth.user.imageData,
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

export const removeRegattaPrefix = (regattaName: string, raceName?: string) => {
  if (!raceName) {
    return
  }
  return raceName.replace(regattaName, '').trim()
}
