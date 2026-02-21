import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import router from '@/router'

import {
  getCurUserInfo,
  getEmailCode,
  resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister,
} from '@/api/user'
import { PageUrl, ResCode } from '@/utils/const'

const InitUserInfo = {
  onlyCode: '',
  tencentSig: '',
  token: '',
}

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref<UserState>({ ...InitUserInfo })
  // 通用函数
  const setInfo = (partial: Partial<UserState>) => {
    userInfo.value = { ...partial }
  }

  // 登录
  const login = async (loginForm: LoginData) => {
    // debugger
    try {
      const { code, data } = await userLogin(loginForm)
      if (code !== ResCode.SUCCESS) {
        return
      }
      setToken({ token: data.token })
      const search = window.location.search
      const urlParams = new URLSearchParams(window.location.search)
      const pathTo = urlParams.get('pathTo')
      if (search) {
        router.push(`/${pathTo}${search}`)
      }
      else {
        router.push('/')
      }
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  const getUserInfo = async () => {
    try {
      const { data } = await getCurUserInfo()
      setInfo(data)
      localStorage.setItem('userInfo', JSON.stringify(data))
    }
    catch (error) {
      clearToken()
      throw error
    }
  }

  // 登出
  const logout = async () => {
    localStorage.setItem('authData', JSON.stringify({
      onlyCode: '',
      tencentSig: '',
      token: '',
    }))
    router.push('/login')
    /* try {
      await userLogout()
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    } */
  }

  const getCode = async () => {
    try {
      const data = await getEmailCode()
      return data
    }
    catch { }
  }

  // 重置密码
  const reset = async () => {
    try {
      const data = await resetPassword()
      return data
    }
    catch { }
  }

  // 注册
  const register = async () => {
    /* try {
      const data = await userRegister()
      return data
    }
    catch { } */
  }

  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    getCode,
    reset,
    register,
  }
}, {
  persist: true,
})

export default useUserStore
