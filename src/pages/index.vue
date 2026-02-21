<script setup lang="ts">
import { usechatStore } from '@/stores'
/* import { TUIKit } from '../TUIKit'
import { TUICallKit } from '@trtc/calls-uikit-vue' */
import { TUIChat, TUIContact, TUIConversation, TUIGroup, TUISearch } from '../TUIKit/components'
import { StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine-lite'
import type Drag from '../TUIKit/components/common/Drag'
import { enableSampleTaskStatus } from '../TUIKit/utils/enableSampleTaskStatus'
import { getCurUserInfo } from '@/api/user'

import { TUIChatKit } from '../TUIKit' // 从你本地拷贝的TUIKit目录引入
import { genTestUserSig } from '../TUIKit/debug' // 从你本地拷贝的TUIKit目录引入
import { TUILogin } from '@tencentcloud/tui-core-lite'
import { framework } from '../TUIKit/adapter-vue' // 获取框架适配器
import { useUserStore } from '@/stores'

const userStore = useUserStore()
/* const SDKAppID = 1600112428
const userSig = 'eJwtzE8LgjAcxvH3snPob9PNIXTILhH2PzyIl3DLfkWxpgspeu*Zenw*D3w-5JgevJe2JCbMAzLpNyr9aPCMPZe6vuB41Op2MgYViakAoJSFTA6Pbg1a3TnnnAHAoA3e-xaJUAZc8GCsYNV1r1HmtvuUYZ6sCn8jlpV0bdjYReGXws3z2fNtDEvsLnNrmJLvD4O3MfY_'
const userId = 'ceshi' */
const isH5 = true
const currentConversationID = ref('')
const currentNavBar = ref('message')
const dragRef = ref<typeof Drag>()
const isCalling = ref(false)
const isMinimized = ref(false)

const chatStore = usechatStore()

/* 跳转到聊天页面时隐藏tabbar逻辑 */
// 监听currentConversationID变化
watch(currentConversationID, (newVal) => {
  chatStore.setChatStatus(!!newVal)
}, { immediate: true })
// 组件卸载时重置状态
onUnmounted(() => {
  chatStore.setChatStatus(false)
})

// im登录
let userId = ''
getCurUserInfo().then((res) => {
  userId = res.data.phoneNum
  const SDKAppID = userStore.userInfo.sdkappid // 替换成你的 SDKAppID
  const secretKey = userStore.userInfo.key
  // 填入你的密钥，GenerateTestUserSig会用到

  // 1. 初始化 TUIChatKit
  TUIChatKit.init()

  // 2. 登录IM服务
  TUILogin.login({
    SDKAppID,
    userID: userId,
    userSig: genTestUserSig({ SDKAppID, secretKey, userID: userId }).userSig,
    // useUploadPlugin: true, // 如果需要发送图片、文件等富媒体消息，请设置为true
    framework, // 传入Vue框架适配器
  }).then(() => {
    console.log('腾讯IM登录成功')
  }).catch((error) => {
    console.error('腾讯IM登录失败:', error)
  })
})

TUIStore.watch(StoreName.CONV, {
  currentConversationID: (id: string) => {
    console.log('俩踢踢踢踢踢踢踢', id)

    currentConversationID.value = id
  },
})

function beforeCalling() {
  isCalling.value = true
  isMinimized.value = false
  enableSampleTaskStatus('call')
}

function afterCalling() {
  isCalling.value = false
  isMinimized.value = false
}

function onMinimized(oldMinimizedStatus: boolean, newMinimizedStatus: boolean) {
  isMinimized.value = newMinimizedStatus
  dragRef?.value?.positionReset()
}
</script>

<template>
  <!-- 最外层：固定定位，铺满整个屏幕，禁止滚动 -->
  <div class="flex flex-col fixed overflow-hidden">
    <!-- 标题栏 -->
    <div
      v-if="!currentConversationID"
      class="text-18px text-[#fff] font-700 pb-5px pt-10px text-center bg-[#0256FF] flex flex-shrink-0 items-center justify-center relative"
    >
      消息
    </div>

    <!-- 主要内容区域：占满剩余空间 -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <!-- 非聊天界面布局 -->
      <div v-if="!currentConversationID" class="flex flex-col h-full w-full overflow-hidden">
        <!-- 消息Tab -->
        <div v-show="currentNavBar === 'message'" class="flex flex-1 flex-col min-h-100vh min-w-100vw overflow-hidden">
          <TUISearch search-type="global" />
          <TUIConversation />
          <TUIContact display-type="selectFriend" />
        </div>
        <!-- 关系Tab -->
        <!-- <div v-show="currentNavBar === 'relation'" class="flex flex-1 flex-col min-h-0 overflow-hidden">
          <TUIContact display-type="contactList" @switch-conversation="currentNavBar = 'message'" />
        </div> -->
        <!-- 个人资料Tab -->
        <!-- <div v-show="currentNavBar === 'profile'" class="flex flex-1 flex-col min-h-0 overflow-hidden">
          <Profile display-type="all" />
        </div> -->
      </div>
      <!-- 聊天界面 单聊 群聊 -->
      <TUIChat v-else class="h-full w-full overflow-hidden" />

      <!-- 弹窗类组件 -->
      <!-- 添加群聊页面 -->
      <TUIGroup class="chat-popup" />
      <TUISearch class="chat-popup" search-type="conversation" />
    </div>

    <!-- 通话组件 -->
    <!-- <Drag ref="dragRef" :show="isCalling" dom-class-name="callkit-drag-container">
      <TUICallKit
        class="callkit-drag-container"
        :class="[`callkit-drag-container-${isMinimized ? 'mini' : isH5 ? 'h5' : 'pc'}`]" :allowed-minimized="true"
        :allowed-full-screen="false" :before-calling="beforeCalling" :after-calling="afterCalling"
        :on-minimized="onMinimized"
      />
    </Drag> -->
  </div>
</template>

<style lang="scss" scoped>
/* .van-cell {
  --van-cell-font-size: 15px;
} */
</style>

<route lang="json5">
{
  name: 'Message_new'
}
</route>
