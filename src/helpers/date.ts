import {
  get,
  head,
  isNumber,
  isString,
} from 'lodash'
import momentDurationSetup from 'moment-duration-format'
import moment from 'moment/min/moment-with-locales'
import { usesAutoDateAndTime, usesAutoTimeZone } from 'react-native-localize'
import { isPlatformAndroid } from 'environment'
import I18n, { SupportedLocales } from 'i18n'
import Logger from './Logger'

momentDurationSetup(moment)

// default format = 'dddd, MMMM DD, YYYY  ·  hh:mm a'
const defaultLocale = SupportedLocales.en

const getSupportedLocale = (locale: string) => {
  if (isNumber(locale) || !locale || !isString(locale) || locale.length < 2) {
    return defaultLocale
  }

  const convertedLocale = locale.substring(0, 2).toLowerCase()
  return SupportedLocales[convertedLocale] || defaultLocale
}

const defaultDateFormat = (locale: string, dateFormatText = 'll', timeFormatText = 'LT') => {
  const momentInstance = moment().locale(locale)
  const localeData = momentInstance.localeData()

  const dayFormat = 'dddd'
  const timeFormat = localeData.longDateFormat(timeFormatText)
  const dateFormat = localeData.longDateFormat(dateFormatText)

  return {
    dayFormat,
    timeFormat,
    dateFormat,
  }
}

const cleanYearFromFormat = (format: string) => {
  try {
    const formatWithoutYear: string | undefined = format.replace(/Y/g, '')
    const formatSplitPrefix = head(formatWithoutYear.split(','))
    return formatSplitPrefix && formatSplitPrefix.trim()
  } catch (err) {
    Logger.debug(err)
  }
  return format
}


export const durationText = (startDateText?: string) => {
  if (!startDateText) {
    return
  }
  const diff = moment().startOf('second') - moment(startDateText).startOf('second')
  const duration = moment.duration(diff)
  if (duration.asDays() >= 1) { // use moment-duration-format for more than 24 hours format
    return duration.format('HH:mm:ss')
  } else { // use moment format for less the 24 hours format 00:00:00
    return moment.utc(duration.asMilliseconds()).startOf('second').format('HH:mm:ss')
  }
}

export const dateText = (dateValue: string | number, format = 'LL') => {
  const supportedLocale = getSupportedLocale(I18n.locale)
  return moment(dateValue).locale(supportedLocale).format(get(defaultDateFormat(supportedLocale, format), 'dateFormat'))
}

export const dateFromToText = (
  startValue?: string | number,
  endValue?: string | number,
  format = 'L',
  omitSameDay: boolean = true,
) => {
  if (!startValue) { return null }

  const supportedLocale = getSupportedLocale(I18n.locale)
  const dateFormat = get(defaultDateFormat(supportedLocale, format), 'dateFormat')

  const startDate = moment(startValue).locale(supportedLocale)
  const endDate =  moment(endValue).locale(supportedLocale)
  if (!endValue || (omitSameDay && startDate.isSame(endDate, 'day'))) {
    return startDate.format(dateFormat)
  }
  const startFormat = startDate.year() === endDate.year() ? cleanYearFromFormat(dateFormat) : dateFormat
  return `${startDate.format(startFormat)} - ${endDate.format(dateFormat)}`
}

export const dateTimeText = (dateValue: string | number | Date) => {
  const supportedLocale = getSupportedLocale(I18n.locale)
  const formatData = defaultDateFormat(supportedLocale)
  const { timeFormat, dateFormat } = formatData
  return moment(dateValue).locale(supportedLocale).format(`${dateFormat} - ${timeFormat}`)
}

/**
 * Returns a hypenated string from one or two date values
 */
export const dateRangeText = (dateValue1: string | number | Date, dateValue2?: string | number | Date): string => {
  const supportedLocale = getSupportedLocale(I18n.locale)

  const moment1 =  moment(dateValue1).locale(supportedLocale)
  const moment2 = dateValue2 ? moment(dateValue1).locale(supportedLocale) : null
  
  // No date2 or the same day
  if (moment2 == null || moment1.isSame(moment2, 'day')) {
    return moment1.format('D. MMMM YYYY')

  // Same month
  } else if (moment1.isSame(moment2, 'month')) {
    return moment1.format('D') + '–'+ moment2.format('D. MMMM YYYY') // EN Dash

  // Same year
  } else if (moment1.isSame(moment2, 'year')) {
    return moment1.format('D. MMMM') + ' – '+ moment2.format('D. MMMM YYYY') // EN Dash + thin spaces

  // Not the same year
  } else {
    return moment1.format('D. MMMM YYYY') + ' – '+ moment2.format('D. MMMM YYYY') // EN Dash + thin spaces
  }
}

export const dateShortText = (dateValue: string | number | Date) => {
  const supportedLocale = getSupportedLocale(I18n.locale)
  return moment(dateValue).locale(supportedLocale).format('DD.MM.YYYY')
}

export const dateTimeShortHourText = (dateValue: string | number | Date) => {
  const supportedLocale = getSupportedLocale(I18n.locale)
  return moment(dateValue).locale(supportedLocale).format('HH:mm')
}

export const timeText = (seconds?: number) => {
  if (!seconds) {
    return 0
  }
  const duration = moment.duration(seconds, 'seconds')
  return duration.format('hh:mm:ss', { trim: false })
}

export const getNowAsMillis = (addValue?: number, category?: 'y' | 'd' | 'm' | 's' | 'ms' | 'hour') => {
  const momentTime = moment().utc() // TODO: check if utc instead of local value
  return (addValue && category ? momentTime.add(addValue, category) : momentTime).valueOf()
}

export const getTimestampAsMillis = (timestamp?: string) => {
  const momentValue = timestamp ? moment(timestamp) : moment()
  return momentValue.utc().valueOf()
}

export const currentTimestampAsText = () => moment().utc().startOf('second').format()

export const isExpired = (timestamp: string, limitInHours: number) => {
  if (!timestamp) {
    return true
  }
  return moment(timestamp).utc().add(limitInHours, 'hour').isBefore(moment().utc())
}

export const getDurationInS = (start?: number, end?: number) => (start && end && ((end - start) / 60)) || 0

export const useAutomaticDateTimeAndTimezone = () =>
  isPlatformAndroid ? (usesAutoDateAndTime() && usesAutoTimeZone()) : true
