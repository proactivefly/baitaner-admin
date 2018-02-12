import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 根据路由中meta.role信息  判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) { 
  if (route.meta && route.meta.roles) { //如果路由元meta中配有roles
    return roles.some(role => route.meta.roles.indexOf(role) >= 0) //如果有匹配到的 返回true
  } else {
    return true //不需要权限就能访问
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {//如果有子路由
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters// 返回可进入的路由数组
}

const permission = { //定义权限state
  state: {
    routers: constantRouterMap, //基础路由图谱
    addRouters: [] //动态路由图谱
  },
  mutations: {
    SET_ROUTERS: (state, routers) => { //设置路由
      state.addRouters = routers //通过权限获取的  待添加路由
      state.routers = constantRouterMap.concat(routers) //原有路由上拼接 待添加的路由 （新权限）
      // state.routers = constantRouterMap.concat(state.addRouters)

    }
  },
  actions: {
    GenerateRoutes({ commit }, data) { //
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) { //如果角色包含 管理员  ，拥有全部权限 无需过滤
          accessedRouters = asyncRouterMap 
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles) //过滤 掉不能进入的路由
        }
        commit('SET_ROUTERS', accessedRouters)  //设置state中路由
        resolve()
      })
    }
  }
}

export default permission
