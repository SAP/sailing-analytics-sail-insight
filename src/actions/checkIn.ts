import I18n from 'i18n'
import { Alert } from 'react-native'
import { createAction } from 'redux-actions'
import { always, applySpec, compose, concat, defaultTo, filter, findLast, has, head, isNil,
  map, partition, pick, prop, propEq, reject, toPairs, is, cond, anyPass, T, F  } from 'ramda'

import { dataApi } from 'api'
import ApiException from 'api/ApiException'
import { STATUS_INTERNAL_ERROR, STATUS_NOT_FOUND } from 'api/constants'
import { CheckIn, CheckInUpdate } from 'models'
import * as CheckInService from 'services/CheckInService'
import CheckInException from 'services/CheckInService/CheckInException'
import * as Screens from 'navigation/Screens'

import { fetchEntityAction, withDataApi } from 'helpers/actions'
import Logger from 'helpers/Logger'
import { showNetworkRequiredSnackbarMessage } from 'helpers/network'
import { getErrorDisplayMessage } from 'helpers/texts'
import { DispatchType, GetStateType } from 'helpers/types'
import { alertPromise, spreadableList } from 'helpers/utils'

import { fetchEvent, updateLoadingEventList } from 'actions/events'
import { fetchAllRaces, fetchRegatta } from 'actions/regattas'
import { isLoggedIn } from 'selectors/auth'
import { checkInObjectToText, getCheckInByLeaderboardName } from 'selectors/checkIn'
import { getMarkDeviceTrackingByMarkConfiguration } from 'selectors/course'
import { getLocationTrackingStatus } from 'selectors/location'
import { LocationTrackingStatus } from 'services/LocationService'
import { isNetworkConnected as isNetworkConnectedSelector } from 'selectors/network'
import { getMark } from '../selectors/mark'
import { getRegatta, getRegattaNumberOfRaces } from '../selectors/regatta'
import { getHashedDeviceId } from 'selectors/user'
import { getStore } from '../store'
import { saveTeam } from './user'

export const DELETE_MARK_BINDING = 'DELETE_MARK_BINDING'
export const UPDATE_DELETING_MARK_BINDING = 'UPDATE_DELETING_MARK_BINDING'

export const deleteMarkBinding = createAction(DELETE_MARK_BINDING)
export const updateDeletingMarkBinding = createAction(UPDATE_DELETING_MARK_BINDING)

export const updateCheckInAction = createAction('UPDATE_CHECK_IN')
export const removeCheckIn = createAction('REMOVE_CHECK_IN')
export const updateLoadingCheckInFlag = createAction('UPDATE_LOADING_CHECK_IN_FLAG')

export const updateCheckIn = (checkIn: any) => async (dispatch, getState) =>
  dispatch(updateCheckInAction({
    joinedAnonymously: !isLoggedIn(getState()),
    ...checkIn
  }))

export const saveCheckInToEventInventory = async (checkInData: any) => {
  const { eventId, leaderboardName, secret, serverUrl } = checkInData
  const deviceId = CheckInService.getDeviceId()
  const api = dataApi()

  const thisDeviceTrackedElements = compose(
    map(([idType, id]) => ({ deviceId, [idType]: id })),
    toPairs,
    reject(isNil),
    pick(['competitorId', 'markId', 'boatId'])
  )(checkInData)

  const trackedElements = compose(
    concat(thisDeviceTrackedElements),
    defaultTo([]),
    prop('trackedElements')
  )(checkInData)

  // Defaults to false
  const isArchived = !!checkInData.isArchived

  return api.updateEventInventory(eventId, leaderboardName, {
    isArchived,
    trackedElements,
    regattaSecret: secret,
    url: serverUrl,
  })
}

export const updateCheckInAndEventInventory = (
  checkInData: CheckInUpdate
) => async (dispatch, getState) => {
  const isNetworkConnected = isNetworkConnectedSelector(getState())
  if (!isNetworkConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }

  dispatch(updateCheckIn(checkInData))

  if (isLoggedIn(getState())) {
    const completeCheckInData = getCheckInByLeaderboardName(
      checkInData.leaderboardName
    )(getState())

    await saveCheckInToEventInventory(completeCheckInData)
  }

  // Same return value as updateCheckIn
  return { payload: checkInData }
}

export const reuseBindingFromOtherDevice = (
  checkInData: CheckIn,
  showAlert: boolean,
) => async (dispatch, getState) => {
  if (!isNetworkConnectedSelector(getState())) return

  const { trackedElements = [], leaderboardName, secret, serverUrl } = checkInData
  const [competitorBindings, otherBindings] = partition(
    prop('competitorId')
  )(trackedElements)

  if (competitorBindings.length === 0) return
  const binding = head(competitorBindings)

  if (showAlert) {
    const checkInText = checkInObjectToText(binding)(getState())
    const message = `You have already bound another device to ${checkInText} with the same account, do you want to rebind this device to it?`
    const cancelled = !(await alertPromise('', message, I18n.t('button_yes')))
    if (cancelled) return
  }

  const api = dataApi(serverUrl)

  // Unbind the other devices
  await Promise.all(competitorBindings.map(({ deviceId, ...objectId }) => {
    const body = CheckInService.checkoutDeviceMappingData({
      ...objectId,
      secret
    }, deviceId)
    // Ignore exceptions.
    // Getting 400s might indicate the mapping does not exist which would be safe to ignore.
    // But to avoid main functionalities (starting to track for example) not working,
    // because of an unexpected error thrown here when unbinding devices, we ignore exceptions.
    return api.stopDeviceMapping(leaderboardName, body).catch(err => {})
  }))

  // Bind the current device
  const { deviceId, ...objectId } = binding
  await api.startDeviceMapping(
    leaderboardName,
    CheckInService.checkInDeviceMappingData({ ...objectId, secret }),
  )
  await dispatch(updateCheckInAndEventInventory({ ...objectId, leaderboardName, trackedElements: otherBindings } as CheckInUpdate))
}

export const preventDuplicateCompetitorBindings = (checkIn: any, selectedBoat: any) => async (
  dispatch,
  getState,
) => {
  const { leaderboardName, serverUrl, secret } = checkIn
  const currentCheckIn = getCheckInByLeaderboardName(checkIn.leaderboardName)(getState())
  if (!currentCheckIn) return true

  const { trackedElements = [], competitorId: currentCompetitorId } = currentCheckIn
  const currentCompetitorIdOnAnotherDevice = findLast(prop('competitorId'))(trackedElements)

  // No conflict because there is no current competitor binding
  if (!currentCompetitorId && !currentCompetitorIdOnAnotherDevice) { return true }

  const anonymous = !isLoggedIn(getState())
  // Don't allow an anoymous user to try to join the same race again
  if (currentCompetitorId && anonymous) { return false }

  // If joining with the same competitor as already registered on the same device,
  // go back to avoid duplicate bindings to the same competitor
  const selectedBoatCompetitorId = (selectedBoat?.competitorId || {})[serverUrl]
  if (
    currentCompetitorId &&
    (checkIn.competitorId === currentCompetitorId ||
      selectedBoatCompetitorId === currentCompetitorId)
  ) {
    return false
  }

  const bindingToRemove = currentCompetitorIdOnAnotherDevice ?? {
    competitorId: currentCompetitorId,
    deviceId: CheckInService.getDeviceId()
  }
  const checkInText = checkInObjectToText(bindingToRemove)(getState())
  const message = `You have already bound this account to ${checkInText} in this event, do you want to overwrite that binding?`
  const overwrite = await alertPromise('', message, I18n.t('button_yes'))
  if (!overwrite) return false


  const api = dataApi(serverUrl)
  const { deviceId } = bindingToRemove
  const body = CheckInService.checkoutDeviceMappingData({
    ...bindingToRemove,
    secret
  }, deviceId)
  await api.stopDeviceMapping(leaderboardName, body).catch(err => {})

  return true
}

export const warnAboutMultipleBindingsToTheSameMark = (markConfiguration: any) => async (dispatch, getState) => {
  const markDeviceTracking: any = getMarkDeviceTrackingByMarkConfiguration(markConfiguration)(getState())
  if (!markDeviceTracking || !markDeviceTracking.trackingDeviceHash) return true
  const differentDeviceBound = markDeviceTracking.trackingDeviceHash !== getHashedDeviceId()
  if (!differentDeviceBound) return false

  const message = 'There\'s already another device bound to this mark. Do you want to continue with the binding?'
  return await alertPromise('', message, I18n.t('button_yes'))
}

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
      trackedElements = []
    } = checkInData

    const fetchBoundObject = objectId => {
      const action = async (id, apiMethod) => {
        try {
          return await dispatch(fetchEntityAction(apiMethod)(leaderboardName, id, secret))
        } catch (err) {} // ignore exceptions like in the actionQueue
      }

      if (objectId.competitorId) {
        return action(objectId.competitorId, dataApi.requestCompetitor)
      }
      if (objectId.markId) {
        return action(objectId.markId, dataApi.requestMark)
      }
      if (objectId.boatId) {
        return action(objectId.boatId, dataApi.requestBoat)
      }
    }

    const fetchTrackedElementsObjects = trackedElements.map(fetchBoundObject)

    await Promise.all([
      ...spreadableList(eventId, dispatch(fetchEvent(dataApi.requestEvent)(eventId, secret))),
      dispatch(fetchEntityAction(dataApi.requestLeaderboardV2)(leaderboardName, secret)),
      dispatch(fetchRegatta(regattaName, secret, serverUrl)),
      dispatch(fetchAllRaces(regattaName, secret, serverUrl)),
      fetchBoundObject({ competitorId }),
      fetchBoundObject({ boatId }),
      fetchBoundObject({ markId }),
      ...fetchTrackedElementsObjects
    ])

    return checkInData
  },
)

export const fetchEventList = () => async(dispatch, getState) => {
  const isNetworkConnected = isNetworkConnectedSelector(getState())
  if (!isNetworkConnected) {
    showNetworkRequiredSnackbarMessage()
    return
  }

  dispatch(updateLoadingEventList(true))

  const api = dataApi()
  const { trackedEvents } = await api.requestEventInventory()

  const deviceId = CheckInService.getDeviceId()
  const getLastTrackedElementOfType = (trackedElementType: string) => compose(
    prop(trackedElementType),
    defaultTo({}),
    findLast(has(trackedElementType)),
    filter(propEq('deviceId', deviceId)),
    prop('trackedElements')
  )

  const getTrackedElementsFromDifferentDevices = compose(
    reject(propEq('deviceId', deviceId)),
    prop('trackedElements')
  )

  const checkIns = map(applySpec({
    eventId: prop('eventId'),
    regattaName: prop('leaderboardName'),
    leaderboardName: prop('leaderboardName'),
    serverUrl: prop('url'),
    secret: prop('regattaSecret'),
    trackPrefix: always('R'),
    competitorId: getLastTrackedElementOfType('competitorId'),
    boatId: getLastTrackedElementOfType('boatId'),
    markId: getLastTrackedElementOfType('markId'),
    isArchived: prop('isArchived'),
    trackedElements: getTrackedElementsFromDifferentDevices,
  }))(trackedEvents)

  await Promise.all(checkIns.map(async (checkIn) => {
    try {
      await dispatch(collectCheckInData(checkIn))
    } catch (error) {
      const isKnownError = anyPass([is(ApiException), propEq('status', STATUS_INTERNAL_ERROR), propEq('status', STATUS_NOT_FOUND)])
      if (isKnownError(error)) {
        return
      } else {
        throw error
      }
    }
    const regatta = getRegatta(checkIn.regattaName)(getState())
    const numberOfRaces = getRegattaNumberOfRaces(regatta)
    const checkInWithNumberOfRaces = {
      ...checkIn,
      numberOfRaces
    }
    return dispatch(updateCheckIn(checkInWithNumberOfRaces))
  }))

  dispatch(updateLoadingEventList(false))
}

export const fetchCheckIn = (url: string) => async (dispatch: DispatchType) => {
  const data: CheckIn | null = CheckInService.extractData(url)
  if (!data) {
    throw new CheckInException('could not extract data.')
  }
  return await dispatch(collectCheckInData(data))
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


  try {
    dispatch(updateLoadingCheckInFlag(true))
    const sessionCheckIn = await dispatch(fetchCheckIn(checkInUrl))
    navigation.navigate(Screens.JoinRegatta, { data: sessionCheckIn })
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

