import { sha256 } from 'js-sha256'
import { compose, join, map, move, reject, isNil, split, __, toUpper } from 'ramda'
import { isArray, isMatch, isNumber, isObject, orderBy } from 'lodash'
import { Alert, Linking, ListView } from 'react-native'

import { urlGenerator } from 'api/config'
import I18n from 'i18n'
import { Race, RaceStats } from 'models'

export const toHashedString = compose(
  toUpper,
  join(' '),
  map(b => b.length === 1 ? `0${b}` : b),
  map(b => b.toString(16)),
  sha256.digest,
  map(c => c.charCodeAt(0)),
  split(''))

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

export const dd2ddm = (xy: array) => {
  const coords = [];

  for (let i = 0; i < xy.length; i++) {
    const arr = [1, 0, 1];
    const spl = xy[i].toString().split('.');
    const dm = Math.abs(parseFloat('.' + xy[i].toString().split('.')[1]) * 60.0)
    const fdm = parseFloat(dm).toFixed(6)
    const parts = fdm.toString().split('.')

    let final = parts[0]

    if (parts[1]) {
      final += '.' + parts[1].substr(0,3)
    }

    arr[0] = Math.abs(xy[i].toString().split('.')[0]) + '°';
    arr[1] = spl.length == 2 ? final + "'" : 0;
    arr[2] = i === 0 ? (xy[i] >= 0 ? 'N' : 'S') : (xy[i] >= 0 ? 'E' : 'W')

    coords[i] = arr;
  }

  return coords;
}

export const ddm2dd = (arr: array) => {
  let coords = [];

  for (let i = 0; i < arr.length; i++) {
    let deg = parseFloat(arr[i][0]),
        min = parseFloat(arr[i][1]),
        dir = parseFloat(arr[i][2])

    coords[i] = dir*(deg+(min/60.0))
  }

  return coords;
}

export const coordinatesToString = ({ latitude_deg, longitude_deg }: any) =>
  compose(
    join(' / '),
    map(compose(
      join(' '),
      move(-1, 0)
    )),
    dd2ddm,
    reject(isNil))(
    [latitude_deg, longitude_deg])