import { constantRouterMap } from '@/router'
import { getNav } from '@/api/login'
import Layout from '@/views/layout/Layout'
import Transition from '@/views/layout/Transition'

/**
 * 通过meta.role判断是否与当前用户权限匹配
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
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function generateRoutes(menuList) {
  const routerList = getRouters(menuList)

  const errorRouter = [
    { path: '*', redirect: '/404', hidden: true }
  ]
  return routerList.concat(errorRouter)
}

function getRouters(menuList) {
  const routers = []
  for (let i = 0; i < menuList.length; i++) {
    const menu = menuList[i]

    const router = {
      path: menu.parentId === 0 ? '/' + menu.path : menu.path,
      component: menu.parentId === 0 ? Layout : Transition,
      name: menu.name,
      meta: {
        title: menu.name,
        icon: menu.icon || 'default'
      },
      children: []
    }
    if (menu.type === 1) {
      router.component = () => import('@/views/' + menu.path + '/index')
    }
    if (menu.children) {
      // router.redirect = '/' + menu.url + '/' + menu.list[0].url
      router.children = getRouters(menu.children)
    }
    routers.push(router)
  }
  return routers
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    permissions: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 获取菜单信息
    GetNav({ commit, state }) {
      return new Promise(resolve => {
        getNav().then(response => {
          const data = response
          commit('SET_PERMISSIONS', data.permissions)
          commit('SET_ROUTERS', generateRoutes(data.menuList))
          resolve()
        })
      })
    }
    // GenerateRoutes({ commit }, data) {
    //   return new Promise(resolve => {
    //     const { roles } = data
    //     let accessedRouters
    //     if (roles.includes('admin')) {
    //       accessedRouters = asyncRouterMap
    //     } else {
    //       accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
    //     }
    //     commit('SET_ROUTERS', accessedRouters)
    //     resolve()
    //   })
    // }
  }
}

export default permission
