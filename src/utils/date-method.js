import moment from 'moment'

export function dateformat(date, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return moment(date).format(formatStr)
}

export function getMothStartAndEnd() {
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
  return [startOfMonth, endOfMonth]
}

export function getDayStartAndEnd() {
  const startOfDay = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const endOfDay = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  return [startOfDay, endOfDay]
}
