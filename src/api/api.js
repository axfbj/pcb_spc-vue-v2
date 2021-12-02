import hierarchicalType from './hierarchical-type'
import keywordValue from './keyword-value'
import inspectionItems from './inspection-items'
import badDefinition from './bad-definition'
import controlGroup from './control-group'
import controlChart from './control-chart'
export default {
  // login(data, token) {
  //   return http.post('/login', data, token)
  // },
  // getUserInfo(data, token) {
  //   return http.get('/getUserInfo', data, token)
  // },
  ...hierarchicalType,
  ...keywordValue,
  ...inspectionItems,
  ...badDefinition,
  ...controlGroup,
  ...controlChart
}
