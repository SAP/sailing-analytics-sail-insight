import moment from 'moment'


export const uiDurationText = (startDateText: string) => {
  const diff = moment() - moment(startDateText)
  return moment.utc(moment.duration(diff).asMilliseconds()).format('HH:mm:ss')
}
