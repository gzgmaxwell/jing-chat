import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from '@/App.vue'
import router from '@/router/index'
import pinia from '@/stores'
import 'virtual:uno.css'
import '@/styles/app.less'
import '@/styles/var.less'
import { i18n } from '@/utils/i18n'

// Vant 桌面端适配
import '@vant/touch-emulator'

/* --------------------------------
Vant 中有个别组件是以函数的形式提供的，
包括 Toast，Dialog，Notify 和 ImagePreview 组件。
在使用函数组件时，unplugin-vue-components
无法自动引入对应的样式，因此需要手动引入样式。
------------------------------------- */
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

// 腾讯im模块
// import { TUIChatKit } from './TUIKit' // 从你本地拷贝的TUIKit目录引入
// import { genTestUserSig } from './TUIKit/debug' // 从你本地拷贝的TUIKit目录引入
// import { TUILogin } from '@tencentcloud/tui-core-lite'
// import { framework } from './TUIKit/adapter-vue' // 获取框架适配器

// 获取用户信息
// let userId = ''
// getCurUserInfo().then((res) => {
//   userId = res.data.phoneNum

//   const SDKAppID = 1600116447 // 替换成你的 SDKAppID
//   // const userSig = 'eJwtzE8LgjAcxvH3snPob9PNIXTILhH2PzyIl3DLfkWxpgspeu*Zenw*D3w-5JgevJe2JCbMAzLpNyr9aPCMPZe6vuB41Op2MgYViakAoJSFTA6Pbg1a3TnnnAHAoA3e-xaJUAZc8GCsYNV1r1HmtvuUYZ6sCn8jlpV0bdjYReGXws3z2fNtDEvsLnNrmJLvD4O3MfY_'
//   const secretKey = '0b46a8213d81da2e212f683bf101f9633c9a636c18eccec09f92c41245b54647' // 填入你的密钥，GenerateTestUserSig会用到

//   // 1. 初始化 TUIChatKit
//   TUIChatKit.init()

//   // 2. 登录IM服务
//   TUILogin.login({
//     SDKAppID,
//     userID: userId,
//     userSig: genTestUserSig({ SDKAppID, secretKey, userID: userId }).userSig,
//     // useUploadPlugin: true, // 如果需要发送图片、文件等富媒体消息，请设置为true
//     framework, // 传入Vue框架适配器
//   }).then(() => {
//     console.log('腾讯IM登录成功')
//   }).catch((error) => {
//     console.error('腾讯IM登录失败:', error)
//   })
// })
const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
app.use(pinia)
app.use(i18n)

app.mount('#app')
