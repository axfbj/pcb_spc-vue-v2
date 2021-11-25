import hierarchicalType from './hierarchicalType'
import keywordValue from './keywordValue'
import inspectionItems from './inspectionItems'
export default {
  // login(data, token) {
  //   return http.post('/login', data, token)
  // },
  // getUserInfo(data, token) {
  //   return http.get('/getUserInfo', data, token)
  // },
  ...hierarchicalType,
  ...keywordValue,
  ...inspectionItems
}
