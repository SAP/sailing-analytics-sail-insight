import I18n from 'i18n'
import { Alert } from 'react-native'
import { createAction } from 'redux-actions'

import { CheckIn, CheckInUpdate, TeamTemplate } from 'models'
import * as CheckInService from 'services/CheckInService'
import CheckInException from 'services/CheckInService/CheckInException'
import * as Screens from 'navigation/Screens'

import { ActionQueue, fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { getErrorDisplayMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import { spreadableList } from 'helpers/utils'

import { fetchEvent } from 'actions/events'
import { fetchAllRaces, fetchRegatta } from 'actions/regattas'
import { getActiveCheckInEntity, getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getLocationTrackingStatus } from 'selectors/location'
import { LocationTrackingStatus } from 'services/LocationService'
import { mapResToCompetitor } from '../models/Competitor'
import { mapResToRegatta } from '../models/Regatta'
import { getCompetitor } from '../selectors/competitor'
import { getRegatta } from '../selectors/regatta'
import { getUserTeamByNameBoatClassNationalitySailnumber } from '../selectors/user'
import { getStore } from '../store'
import { saveTeam } from './user'

export const DELETE_MARK_BINDING = 'DELETE_MARK_BINDING'
export const UPDATE_DELETING_MARK_BINDING = 'UPDATE_DELETING_MARK_BINDING'

export const deleteMarkBinding = createAction(DELETE_MARK_BINDING)
export const updateDeletingMarkBinding = createAction(UPDATE_DELETING_MARK_BINDING)

export const updateCheckIn = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')
export const updateLoadingCheckInFlag = createAction('UPDATE_LOADING_CHECK_IN_FLAG')

export const collectCheckInData = (checkInData?: CheckIn) => withDataApi(checkInData && checkInData.serverUrl)(
  async (dataApi, dispatch) => {
    if (!checkInData) {
      throw new CheckInException('missing data')
    }
    checkInData.regattaName = checkInData.regattaName || checkInData.leaderboardName
    checkInData.leaderboardName = checkInData.leaderboardName || checkInData.regattaName
    const {
      eventId,
      leaderboardName,
      competitorId,
      markId,
      boatId,
      regattaName,
      serverUrl,
      secret,
    } = checkInData

    const queue = ActionQueue.create(dispatch, [
      ...spreadableList(eventId, fetchEvent(dataApi.requestEvent)(eventId, secret)),
      fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboardName, secret),
      fetchRegatta(regattaName, secret, serverUrl),
      fetchAllRaces(regattaName, secret, serverUrl),
      ...spreadableList(competitorId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestCompetitor)(leaderboardName, competitorId, secret),
        { ignoreException: true },
      )),
      ...spreadableList(markId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestMark)(leaderboardName, markId, secret),
        { ignoreException: true },
      )),
      ...spreadableList(boatId, ActionQueue.createItem(
        fetchEntityAction(dataApi.requestBoat)(leaderboardName, boatId, secret),
        { ignoreException: true },
      )),
    ])
    await queue.execute()

    return checkInData
  },
)

export const fetchCheckIn = (url: string) => async (dispatch: DispatchType) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  return await dispatch(collectCheckInData(data))
}

export const isEventAlreadyJoined = ({ eventId }: CheckIn, activeCheckIns: any) =>
  Object.values(activeCheckIns).map((item: any) => item.eventId).includes(eventId)


export const checkIn = (data: CheckIn, alreadyJoined: boolean, navigation:object) => async (dispatch: DispatchType, getState: GetStateType) => {
  if (!data) {
    throw new CheckInException('data is missing')
  }
  dispatch(updateCheckIn(data))

  if (data.competitorId || data.markId || data.boatId) {
    await dispatch(registerDevice(data.leaderboardName))
    const update: CheckInUpdate = { leaderboardName: data.leaderboardName }
    if (data.competitorId) {
      update.trackingContext = 'COMPETITOR'
    } else if (data.boatId) {
      update.trackingContext = 'BOAT'
    } else if (data.markId) {
      update.trackingContext = 'MARK'
    }
    dispatch(updateCheckIn(update))
    navigation.navigate(Screens.Sessions)

    if (data.competitorId) {
      const competitor  = mapResToCompetitor(getCompetitor(data.competitorId)(getStore().getState()))
      const regatta = mapResToRegatta(getRegatta(data.regattaName)(getStore().getState()))

      if (competitor && competitor.name && competitor.nationality && competitor.sailId &&
        regatta && regatta.boatClass) {
        // find team by name, boatClass, nationality and sailNumber
        const existingTeam = getUserTeamByNameBoatClassNationalitySailnumber(competitor.name,
                                                                             regatta.boatClass,
                                                                             competitor.nationality,
                                                                             competitor.sailId)(getStore().getState())
        if (!existingTeam) {
          const team = {
            name: competitor.name,
            nationality: competitor.nationality,
            sailNumber: competitor.sailId,
            boatClass: regatta.boatClass,
          } as TeamTemplate
          dispatch(saveTeam(team))
        } else {
          // TODO Attach competitor image to session
        }
      }
    }
  }
  if (!data.competitorId && !data.markId && !data.boatId) {
    navigation.navigate(Screens.EditCompetitor, { data })
  }
}

export const registerDevice = (leaderboardName: string, data?: Object) => withDataApi({ leaderboard: leaderboardName })(
  async (dataApi, dispatch, getState) => {
    const checkInData = getCheckInByLeaderboardName(leaderboardName)(getState())

    await dataApi.startDeviceMapping(
      leaderboardName,
      { ...CheckInService.checkInDeviceMappingData(checkInData),
        ...data
      }
    )
  },
)

export const checkOut = (data?: CheckIn) => withDataApi(data && data.serverUrl)(
  async (dataApi, dispatch) => {
    if (!data) {
      return
    }
    const body = CheckInService.checkoutDeviceMappingData(data)
    await dataApi.stopDeviceMapping(data.leaderboardName, body)
    await dispatch(removeCheckIn(data))
  },
)

export const joinLinkInvitation = (checkInUrl: string, navigation: any) =>
  async (dispatch: DispatchType, getState: GetStateType) => {
  let error: any

  if (getLocationTrackingStatus(getState()) === LocationTrackingStatus.RUNNING) {
    Alert.alert(
      I18n.t('text_deep_link_tracking_active_title'),
      I18n.t('text_deep_link_tracking_active_message'),
      [{ text: 'OK' } ],
      { cancelable: false }
    )

    return
  }

  try {
    dispatch(updateLoadingCheckInFlag(true))
    const sessionCheckIn = await dispatch(fetchCheckIn(checkInUrl))
    const activeCheckIns = getActiveCheckInEntity(getState()) || {}
    const alreadyJoined = isEventAlreadyJoined(sessionCheckIn, activeCheckIns)
    navigation.navigate(Screens.JoinRegatta, { data: { checkInData: sessionCheckIn, alreadyJoined } })
  } catch (err) {
    Logger.debug(err)
    error = err
  } finally {
    dispatch(updateLoadingCheckInFlag(false))
    if (error) {
      // workaround for stuck fullscreen loading indicator when alert is called
      setTimeout(async () => Alert.alert(getErrorDisplayMessage(error)), 800)
    }
  }
}

