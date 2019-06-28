import { isArray, isMatch, isNumber, isObject, orderBy } from 'lodash'
import { Alert, Linking, ListView } from 'react-native'

import { urlGenerator } from 'api/config'
import I18n from 'i18n'
import { Race, RaceStats } from 'models'


export const getListViewDataSource = (data: any, sectionIds?: any[]) => {
  const dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => (r1 !== r2),
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  })
  return isArray(data) ?
  dataSource.cloneWithRows(data) :
  dataSource.cloneWithRowsAndSections(data,  sectionIds)
}

export const notImplementedYetAlert = () => {
  Alert.alert(I18n.t('text_not_implemented_yet'))
}

export const listKeyExtractor = (item: any, index: number) => `${JSON.stringify(item)}${index}`


export const extractResizeModeFromStyle: (s: any) => {resizeMode?: any, stripped: any} = (style: any) => {
  if (isArray(style)) {
    let tempMode: any
    const strippedStyles = style.map((item: any) => {
      if (!item) {
        return item
      }
      const { resizeMode, ...stripped } = item
      tempMode = resizeMode || tempMode
      return stripped
    })
    return { resizeMode: tempMode, stripped: strippedStyles }
  }
  if (isObject(style)) {
    const { resizeMode, ...stripped } = style
    return { stripped, resizeMode }
  }
  return {
    stripped: style,
  }
}

export const hasSameValues = (objA: any, objB: any) => {
  if (!objA || !objB) {
    return false
  }
  return isMatch(objA, objB)
}

export function getOrderListFunction<Type = any>(valueKeys: string[], order?: 'asc' | 'desc') {
  return (list: Type[]) => orderBy(list, valueKeys, [order as string])
}

export const spreadableList = (condition: any, ...params: any[]) => condition ? params : []


const getAvg = ({ counter = 0, sum = 0 } = {}) => {
  return counter > 0 ? sum / counter : 0
}
const add = (avg: {counter: number, sum: number}, value?: number) => {
  if (!isNumber(value)) {
    return avg
  }
  avg.counter += 1
  avg.sum += value
  return avg
}
export const getStatsFromTracks = (tracks: Race[]) => {
  if (!tracks) {
    return
  }
  let avgSpeedDown = { counter: 0, sum: 0 }
  let avgSpeedUp = { counter: 0, sum: 0 }
  let maxSpeedDown = 0
  let maxSpeedUp = 0
  let timeTraveled = 0
  let distanceTraveled = 0
  let maneuverCount = 0
  tracks.forEach((track) => {
    const stats = track.statistics
    if (!stats) {
      return
    }
    avgSpeedDown = add(avgSpeedDown, stats.avgSpeedDownwindKts)
    avgSpeedUp = add(avgSpeedUp, stats.avgSpeedUpwindKts)
    maxSpeedDown = Math.max(stats.maxSpeedDownwindKts || 0, maxSpeedDown)
    maxSpeedUp = Math.max(stats.maxSpeedUpwindKts || 0, maxSpeedUp)
    timeTraveled += stats.timeTraveledInS ? stats.timeTraveledInS : 0
    distanceTraveled += stats.distanceInM ? stats.distanceInM : 0
    maneuverCount += stats.numberOfManeuvers ? stats.numberOfManeuvers : 0
  })
  const result = {
    avgSpeedDownwindKts: getAvg(avgSpeedDown),
    avgSpeedUpwindKts: getAvg(avgSpeedUp),
    maxSpeedDownwindKts: maxSpeedDown,
    maxSpeedUpwindKts: maxSpeedUp,
    numberOfManeuvers: maneuverCount,
    timeTraveledInS: timeTraveled,
    distanceInM: distanceTraveled,
  } as RaceStats
  return result
}

export const openUrl = (url: string) => Linking.openURL(url)
export const addUrlParams = (baseUrl: string, urlParams?: any) => urlGenerator(baseUrl, '')('')({ urlParams })

export const openEmailTo = (email: string, subject?: string, body?: string) =>
  Linking.openURL(addUrlParams(
    `mailto:${email}`,
    {
      ...(subject ? { subject } : {}),
      ...(body ? { body } : {}),
    },
  ))
