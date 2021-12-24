import hierarchicalType from './hierarchical-type'
import keywordValue from './keyword-value'
import inspectionItems from './inspection-items'
import badDefinition from './bad-definition'
import controlGroup from './control-group'
import controlChart from './control-chart'
import controlChartSon from './control-chart-son'
import discriminationRules from './discrimination-rules'
import inspectionRecord from './inspection-record'
import controlChartAbnorma from './control-chart-abnorma'
import reportSummary from './report-summary'
import menuManagement from './menu-management'

import user from './user'
import role from './role'
export default {
  // login(data, token) {
  //   return http.post('/login', data, token)
  // },
  // getUserInfo(data, token) {
  //   return http.get('/getUserInfo', data, token)
  // },

  ...role,
  ...user,
  ...hierarchicalType,
  ...keywordValue,
  ...inspectionItems,
  ...badDefinition,
  ...controlGroup,
  ...controlChart,
  ...controlChartSon,
  ...discriminationRules,
  ...inspectionRecord,
  ...controlChartAbnorma,
  ...reportSummary,
  ...menuManagement
}
