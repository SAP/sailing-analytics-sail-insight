import { sha256 } from 'js-sha256'
import { compose, join, map, move, reject, isNil, split, __, toUpper } from 'ramda'
import { isArray, isMatch, isObject, orderBy } from 'lodash'
import { Alert, Linking } from 'react-native'

import { urlGenerator } from 'api/config'
import I18n from 'i18n'

export const toHashedString = compose(
  toUpper,
  join(' '),
  map(b => b.length === 1 ? `0${b}` : b),
  map(b => b.toString(16)),
  sha256.digest,
  map(c => c.charCodeAt(0)),
  split(''))

export const notImplementedYetAlert = () => {
  Alert.alert(I18n.t('text_not_implemented_yet'))
}

export const alertPromise = (
  title: string,
  message: string | undefined,
  confirmText: string,
  cancelText: string = I18n.t('caption_cancel'),
) =>
  new Promise(resolve => {
    Alert.alert(
      title,
      message,
      [
        ...(cancelText ? [{ text: cancelText, style: 'cancel', onPress: () => resolve(false) }] : []),
        { text: confirmText, onPress: () => resolve(true) },
      ],
      { cancelable: false },
    )
  })

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
    const value = parseFloat(xy[i]);

    // Get degrees (integer part)
    const degrees = Math.floor(Math.abs(value));

    // Get minutes (decimal part * 60)
    const decimalPart = Math.abs(value) - degrees;
    const minutes = (decimalPart * 60).toFixed(6);

    // Format minutes to 3 decimal places
    const minutesParts = minutes.split('.');
    const formattedMinutes = minutesParts[1]
        ? minutesParts[0] + '.' + minutesParts[1].substr(0, 3)
        : minutesParts[0];

    // Determine direction
    const direction = i === 0
        ? (value >= 0 ? 'N' : 'S')
        : (value >= 0 ? 'E' : 'W');

    coords[i] = [
      degrees + '°',
      formattedMinutes + "'",
      direction
    ];
  }

  return coords;
}

export const ddm2dd = (arr: array) => {
  let coords = [];

  for (let i = 0; i < arr.length; i++) {
    let deg = parseFloat(arr[i][0].toString().replace(',', '.')),
        min = parseFloat(arr[i][1].toString().replace(',', '.')),
        dir = parseFloat(arr[i][2].toString())

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
