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

export function getLastMonth(prevMonth1 = 1, prevMonth2 = 1) {
  const startEndTime = [moment(new Date()).subtract(prevMonth1, 'months').startOf('day').format('YYYY-MM-DD HH:mm:ss'), moment(new Date()).subtract(prevMonth2, 'months').endOf('day').format('YYYY-MM-DD HH:mm:ss')]
  return startEndTime
}
export function getPrevMonth(prevMonth1 = 1, prevMonth2 = 1) {
  const startDate = moment().month(moment().month() - prevMonth1).startOf('month').format('YYYY-MM-DD HH:mm:ss')
  const endDate = moment().month(moment().month() - prevMonth2).endOf('month').format('YYYY-MM-DD HH:mm:ss')
  return [startDate, endDate]
}

export function geMothStart(date) {
  return moment(date).startOf('month').format('YYYY-MM-DD HH:mm:ss')
}
