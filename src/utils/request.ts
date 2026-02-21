import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify, showToast } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { ResCode } from './const'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Authorization'

// 域名列表
const DOMAIN_LIST = [
  'https://www.k-xyudil.com/otc/api/',
  'https://www.s-odlrxi.com/otc/api/',
  'https://www.m-lixtdu.com/otc/api/',
  'https://www.p-iwdlax.com/otc/api/'
]

// 存储当前可用的域名
let availableDomain = DOMAIN_LIST[0]

/**
 * 测试域名可用性
 * @param domain 要测试的域名
 * @returns Promise<boolean> 是否可用
 */
async function testDomain(domain: string): Promise<boolean> {
  try {
    // 使用fetch测试，避免使用axios自身造成循环依赖
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const response = await fetch(`${domain}auth/online`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return data.code === 200
    }
    return false
  } catch (error) {
    console.log(`域名 ${domain} 测试失败:`, error)
    return false
  }
}

/**
 * 查找可用域名
 * @returns Promise<string> 可用的域名
 */
export async function findAvailableDomain(): Promise<string> {
  console.log('🔄 开始检测可用域名...')
  
  for (const domain of DOMAIN_LIST) {
    console.log(`测试域名: ${domain}`)
    const isAvailable = await testDomain(domain)
    
    if (isAvailable) {
      console.log(`✅ 找到可用域名: ${domain}`)
      availableDomain = domain
      return domain
    }
    
    console.log(`❌ 域名不可用: ${domain}`)
  }
  
  console.log('⚠️ 所有域名都不可用，使用默认域名')
  availableDomain = DOMAIN_LIST[0]
  return DOMAIN_LIST[0]
}

/**
 * 自动检测并设置baseURL
 * 建议在应用启动时调用一次
 */
export async function initRequestBaseURL(): Promise<void> {
  const domain = await findAvailableDomain()
  console.log(`🎯 设置请求基础URL为: ${domain}`)
  
  // 更新axios实例的baseURL
  request.defaults.baseURL = domain
  
  // 如果需要在localStorage中保存当前选择的域名，可以取消注释下面的代码
  // localStorage.setItem('CURRENT_API_DOMAIN', domain)
}

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // https://h5.jingchat.com.cn/otc/api/
  // import.meta.env.VITE_APP_API_BASE_URL
  baseURL: availableDomain,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  // 添加域名切换逻辑：如果当前请求失败，尝试切换到下一个域名
  if (error.code === 'ECONNABORTED' || error.response?.status === 0) {
    console.log('当前域名可能不可用，尝试切换...')
    // 这里可以添加自动切换域名的逻辑
  }
  
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 如果你需要直接跳转登录页面
      // location.replace(loginRoutePath)
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)

  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken) {
    try {
      const tokenData = JSON.parse(savedToken)
      if (tokenData.token) {
        config.headers[REQUEST_TOKEN_KEY] = tokenData.token
      }
    } catch (error) {
      console.error('解析token失败:', error)
    }
  }
  
  // 动态更新baseURL（如果配置了）
  if (availableDomain && config.baseURL !== availableDomain) {
    config.baseURL = availableDomain
  }

  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: { data: any }) {
  // 非200响应
  if (response.data.code && response.data.code !== ResCode.SUCCESS) {
    showToast(response.data.msg)
  }
  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request