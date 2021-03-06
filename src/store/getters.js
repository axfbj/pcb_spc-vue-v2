const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  username: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  powerCodes: state => state.permission.powerCodes,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  hierarchicalTypes: state => state.hierarchicalTypesDefinition.hierarchicalTypes,
  abnormalMessage: state => state.abnormalMessage.abnormalMessage,
  commonVariable: state => state.commonVariable
}
export default getters
