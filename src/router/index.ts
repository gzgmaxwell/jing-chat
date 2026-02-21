import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import { useRouteCacheStore, useUserStore } from '@/stores'

import { isLogin } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: true, parent: '#app' })

// 路由白名单 - 可以直接修改此数组或通过其他方法动态添加
export const whiteList = ['/login', '/register', '/codeLogin', '/resetpwd']

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// This will update routes at runtime without reloading the page
if (import.meta.hot)
  handleHotUpdate(router)

router.beforeEach(async (to: EnhancedRouteLocation, from, next) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  setPageTitle(to.name)

  // 检查是否在白名单中
  if (whiteList.includes(to.path)) {
    // 如果在白名单中，直接放行
    next()
    return
  }

  // 不在白名单中的路由需要登录验证
  if (isLogin()) {
    // 已登录但用户信息不存在时获取用户信息
    // if (!userStore.userInfo?.uid) {
    //   try {
    //     await userStore.info()
    //   }
    //   catch (error) {
    //     // 如果获取用户信息失败，跳转到登录页
    //     next('/login')
    //     return
    //   }
    // }
    next()
  }
  else {
    // 未登录，跳转到登录页
    const search = window.location.search
    if (search) {
      next(`/login${search}`)
    }
    else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
