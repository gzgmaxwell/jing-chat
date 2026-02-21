<script setup lang="ts">
import { getCurUserInfo } from '@/api/user'
import router from '@/router'
import { ResCode } from '@/utils/const'

// 获取用户信息
const userInfo = ref()
getCurUserInfo().then((res) => {
  if (res.code === ResCode.SUCCESS)
    userInfo.value = res?.data || {}
})

// 模拟状态: 0-未认证,1-初级认证 2-高级认证
const authStatus = computed(() => {
  switch (userInfo.value?.level) {
    case '1':
      return '1'
    case '2':
      return '2'
    default:
      return '0'
  }
})

const limits = ref({
  primary: { buy: '500', sell: '10000' },
})

const onClickLeft = () => router.back()

function goToAdvanced() {
  // 逻辑：必须先完成初级认证
  if (authStatus.value !== '2' && authStatus.value !== '1') {
    // 这里为了演示方便，允许直接点击，实际业务中应取消注释下面这行
    return showToast('请先完成初级认证')
  }
  router.push('/realnameAuth_new/advancedAuth')
}
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">实名认证</span>
      </template>
    </van-nav-bar>

    <!-- 内容区域 -->
    <div class="p-4 flex-1 overflow-y-auto">
      <div class="text-12px text-gray-400 mb-4">
        为保证您的账号安全，请先完成实名认证
      </div>

      <!-- 初级实名认证卡片 -->
      <div class="mb-4 p-3 rounded-xl bg-[#F0F4F8] relative">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-18px text-gray-900 font-bold">
            初级实名认证
          </h3>
          <span v-if="authStatus === '1'" class="text-12px text-green-500 font-medium">已认证</span>
          <span v-else class="text-12px text-red-500 font-medium">未认证</span>
        </div>

        <div class="text-12px text-[#8A8A8D] mb-3 mt-3">
          个人信息+身份证正反面照片
        </div>

        <div class="flex items-end justify-between">
          <div class="text-12px text-[#8A8A8D]">
            日买币限额<span class="text-blue-600 font-medium">{{ limits.primary.buy }}</span>、日卖币限额<span
              class="text-blue-600 font-medium"
            >{{ limits.primary.sell }}</span>
          </div>
          <van-button
            v-if="authStatus === '0'" type="primary" size="small" color="#0052ff"
            class="px-4 rounded-md h-32px w-75px" @click="router.push('/realnameAuth_new/primaryAuth')"
          >
            去认证
          </van-button>
        </div>
      </div>

      <!-- 高级实名认证卡片 -->
      <div class="p-3 rounded-xl bg-[#F0F4F8] relative">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-18px text-gray-900 font-bold">
            高级实名认证
          </h3>
          <span v-if="authStatus === '2'" class="text-12px text-green-500 font-medium">已认证</span>
          <span v-else class="text-12px text-red-500 font-medium">未认证</span>
        </div>

        <div class="text-12px text-[#8A8A8D] mb-3 mt-3">
          个人信息+身份证正反面照片+人脸识别
        </div>

        <div class="flex items-end justify-between">
          <div class="text-12px text-[#8A8A8D]">
            日买币、卖币不限额
          </div>
          <van-button
            v-if="authStatus !== '2'" type="primary" size="small" color="#0052ff"
            class="px-4 rounded-md h-32px w-75px" @click="goToAdvanced"
          >
            去认证
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>
