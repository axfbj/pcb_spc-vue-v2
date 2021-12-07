import moment from 'moment'

export function dateformat(date, formatStr = 'YYYY-MM-DD hh:mm:ss') {
  return moment(date).format(formatStr)
}
