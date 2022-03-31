// import { asyncRoutes, constantRoutes } from '@/router'
import { constantRoutes } from '@/router'
import menu from '@/api/menu-management'
import Layout from '@/layout'
const { menu_tree } = menu

function pare_route_name(package_url) {
  if (!package_url) return ''
  // console.log('package_url', package_url)
  const strArr = package_url.split('-')
  let name_key = ''
  strArr.forEach(i => { name_key += i.replace(i[0], i[0].toUpperCase()) })
  return name_key
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function filterAsyncRoutes2(routes, powerCodes, roles) {
  const res = []
  const roleCodes = powerCodes
  routes.forEach(route => {
    // console.log('route', route)
    // const tmp = { ...route }
    if (route.type === 2) {
      roleCodes.push(route.powerCode)
      if (route.children) {
        filterAsyncRoutes2(route.children, roleCodes, roles).accessedRoutes
      }
      // console.log(roleCodes)
    }
    if (route.type === 1) {
      const strArr = route.href.split('/')
      const tmp = {
        path: route.href,
        name: pare_route_name(strArr[strArr.length - 1]),
        meta: { title: route.title, icon: route.icon },
        hidden: !route.enable,
        // component: () => import(`@/views/${strArr[strArr.length - 1]}/index`),
        component: (resolve) => require([`@/views/${strArr[strArr.length - 1]}/index`], resolve),
        children: route.children
      }
      if (route.pid === '0') {
        tmp.component = Layout
      }
      // 控制图 隐藏  active高亮指向 控制组列表
      if (tmp.name === 'ControlChartDetails') {
        tmp.hidden = true
        tmp.meta.activeMenu = '/statistical-process-control/control-group-list'
      }
      if (tmp.name === 'ControlGroupList') {
        tmp.meta.affix = true // 控制组列表 固定
      }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes2(tmp.children, roleCodes, roles).accessedRoutes
        }
        res.push(tmp)
      }
    }
  })

  // return res
  return {
    accessedRoutes: res,
    powerCodes
  }
}

const state = {
  routes: [],
  addRoutes: [],
  powerCodes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_POWERCODES: (state, powerCodes) => {
    state.powerCodes = powerCodes
  }
}

const actions = {
  async generateRoutes({ commit }, roles) {
    const { code, data } = await menu_tree()
    if (code !== '200' || !data) { return [] }
    // console.log(data)
    const permission_menu = data.find(menu => menu.id === '1')
    if (permission_menu) {
      if (permission_menu.children.length === 1 && permission_menu.children[0].id === '2') {
        const child = permission_menu.children[0]
        if (child.children.length === 1 && child.children[0].id === '5') {
          permission_menu.enable = false
        }
      }
    }

    const { accessedRoutes, powerCodes } = filterAsyncRoutes2(data, [], roles)
    accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
    commit('SET_ROUTES', accessedRoutes)
    commit('SET_POWERCODES', powerCodes)
    return accessedRoutes
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
