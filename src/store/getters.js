const getters = { //相当于state的计算属性
  sidebar: state => state.app.sidebar,//菜单列表
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,//总路由
  addRouters: state => state.permission.addRouters,//新添加路由
  errorLogs: state => state.errorLog.logs
}
export default getters
