import {
  get,
  head,
  isNumber,
  isString,
} from 'lodash'
import momentDurationSetup from 'moment-duration-format'
import moment from 'moment/min/moment-with-locales'

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


export const durationText = (startDateText: string) => {
  const diff = moment() - moment(startDateText)
  return moment.utc(moment.duration(diff).asMilliseconds()).format('HH:mm:ss')
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

export const dateTimeText = (dateValue: string | number) => {
  const supportedLocale = getSupportedLocale(I18n.locale)
  const formatData = defaultDateFormat(supportedLocale)
  const { timeFormat, dateFormat } = formatData
  return moment(dateValue).locale(supportedLocale).format(`${dateFormat} - ${timeFormat}`)
}

export const timeText = (seconds: number) => {
  const duration = moment.duration(seconds, 'seconds')
  return duration.format('hh:mm:ss')
}
