import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from './build/vite/optimize'

// 定义域名列表
const DOMAIN_LIST = [
  'https://www.k-xyudil.com/otc/api/',
  'https://www.s-odlrxi.com/otc/api/',
  'https://www.m-lixtdu.com/otc/api/',
  'https://www.p-iwdlax.com/otc/api/'
]

// // 测试域名可用性的函数
// async function testDomainAvailability(domains: string[]): Promise<string> {
//   const testPromises = domains.map(async (domain) => {
//     try {
//       const testUrl = `${domain}auth/online`
//       console.log(`正在测试域名: ${testUrl}`)
      
//       // 使用fetch测试接口
//       const response = await fetch(testUrl, {
//         method: 'GET',
//         // 设置超时
//         signal: AbortSignal.timeout(5000),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         console.log(`${domain} 响应:`, data)
        
//         if (data.code === 200) {
//           console.log(`✅ 域名可用: ${domain}`)
//           return domain
//         }
//       }
//     } catch (error: any) {
//       console.log(`❌ 域名不可用: ${domains.indexOf(domain) + 1}. ${domain}`, error.message)
//     }
//     return null
//   })

//   // 等待所有测试完成
//   const results = await Promise.all(testPromises)
  
//   // 返回第一个可用的域名
//   const availableDomain = results.find(domain => domain !== null)
  
//   if (availableDomain) {
//     console.log(`🎯 使用域名: ${availableDomain}`)
//     return availableDomain
//   }
  
//   // 如果没有可用的域名，使用第一个作为默认
//   console.log('⚠️  所有域名测试失败，使用默认域名')
//   return domains[0]
// }

// 备用方案：使用axios测试（如果已经安装了axios）
async function testDomainAvailabilityWithAxios(domains: string[]): Promise<string> {
  // 这里使用动态导入，避免在vite配置中强制依赖axios
  const axios = await import('axios')
  
  for (const domain of domains) {
    try {
      const testUrl = `${domain}/auth/online`
      console.log(`正在测试域名: ${testUrl}`)
      
      const response = await axios.default.get(testUrl, {
        timeout: 5000
      })
      console.log(response);
      if (response.data && response.data.code === 200) {
        console.log(`✅ 域名可用: ${domain}`)
        return domain
      }
    } catch (error: any) {
      console.log(`❌ 域名不可用: ${domain}`, error.message)
    }
  }
  
  console.log('⚠️  所有域名测试失败，使用默认域名')
  return domains[0]
}

export default async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  
  // 选择测试方法（根据你的项目依赖）
  let availableDomain = DOMAIN_LIST[0] // 默认使用第一个
  
  // 只在开发模式下测试域名，生产环境使用配置的域名
  // if (mode === 'development') {
    try {
      console.log('🔄 开始测试域名可用性...')
      // availableDomain = await testDomainAvailability(DOMAIN_LIST)
      // 或者使用axios版本：
      availableDomain = await testDomainAvailabilityWithAxios(DOMAIN_LIST)
      console.log(`✅ 最终选择的域名: ${availableDomain}`)
    } catch (error) {
      console.error('域名测试失败:', error)
      availableDomain = DOMAIN_LIST[0]
    }
  // } else {
  //   // 生产环境可以使用环境变量配置的域名
  //   const prodDomain = env.VITE_API_BASE_URL || DOMAIN_LIST[0]
  //   availableDomain = prodDomain.endsWith('/') ? prodDomain : prodDomain + '/'
  // }
console.log(availableDomain,"availableDomainavailableDomainavailableDomain");
  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),

    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: availableDomain,
          ws: false,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          // 添加更多代理配置
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url)
            })
          }
        },
      },
    },

    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.'),
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      outDir: env.VITE_APP_OUT_DIR || 'dist',
    },

    optimizeDeps: { include, exclude },
  }
}