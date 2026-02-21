<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { validPhone } from '@/utils/regexUtils'
import { useUserStore } from '@/stores'
import { LoginType } from '@/utils/const'
import { rsaEncrypt } from '@/utils/jsencryptUtil'

import phoneIcon from '@/assets/tabbar_new/login/phone.png'
import pwdIcon from '@/assets/tabbar_new/login/pwd.png'

const router = useRouter()
const userStore = useUserStore()

const phoneNumber = ref('')
const password = ref('')
const showPassword = ref(false)
const agreeProtocol = ref(false)
const showAreaSelect = ref(false)
const phoneAreaPrefix = ref('86')

// 区号列表
const areaList = ref([
  { text: '中国 +86', value: '86' },
  { text: '中国香港 +852', value: '852' },
  { text: '中国澳门 +853', value: '853' },
  { text: '中国台湾 +886', value: '886' },
  { text: '日本 +81', value: '81' },
  { text: '韩国 +82', value: '82' },
  { text: '美国 +1', value: '1' },
])
const selectedArea = ref(areaList.value[0])

// 处理区号变更
function handleAreaChange(value: { text: string, value: string }) {
  selectedArea.value = value
}

// 确认选择区号
function confirmAreaSelect({ selectedValues }) {
  phoneAreaPrefix.value = selectedValues[0]
  showAreaSelect.value = false
}

// 表单校验
const isFormValid = computed(() => {
  return phoneNumber.value && password.value && agreeProtocol.value
})

// 登录逻辑
async function handleLogin() {
  // 验证
  /* if (phoneNumber.value.trim() === '') {
    showToast('请输入手机号')
    return
  }
  if (!validPhone(phoneNumber.value.trim())) {
    showToast('请输入正确的手机号')
    return
  } */
  if (password.value.trim() === '') {
    showToast('请输入密码')
    return
  }
  if (password.value.trim().length < 6) {
    showToast('密码不能少于6位')
    return
  }
  if (!isFormValid.value) {
    showToast('请先同意隐私政策')
    return
  }

  // 登录
  try {
    // debugger
    await userStore.login({
      phoneNum: phoneNumber.value.trim(),
      password: rsaEncrypt(password.value.trim()) as string,
      deviceModel: 'web',
    })
    await userStore.getUserInfo()
  }
  catch (e) {
    showToast(e.message)
  }
}

// 选手机区号
</script>

<template>
  <div class="p-4 pt-16 bg-white flex min-h-screen justify-center">
    <div class="max-w-xs w-full">
      <!-- 标题 -->
      <h1 class="text-2xl font-bold mb-9 text-center">
        登录
      </h1>

      <!-- 手机号输入 + 区号选择 -->
      <van-cell-group :border="false" class="border-b-1 border-b-[#E5E5E5]">
        <van-field v-model="phoneNumber" type="tel" label-width="55" placeholder="输入手机号">
          <template #left-icon>
            <img :src="phoneIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
          <template #label>
            <div class="border-r-[#E5E5E5] flex items-center" @click="showAreaSelect = true">
              <span>+{{ phoneAreaPrefix }}</span>
              <!-- 使用 Vant 的向下箭头图标 -->
              <van-icon name="arrow-down" style="margin-left: 4px;" />
            </div>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 密码输入 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field
          v-model="password" :type="showPassword ? 'text' : 'password'" label-width="10" placeholder="输入密码"
          :right-icon="showPassword ? 'eye-o' : 'closed-eye'" @click-right-icon="showPassword = !showPassword"
        >
          <template #left-icon>
            <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
        </van-field>
      </van-cell-group>

      <!-- 忘记密码 & 注册 -->
      <div class="text-sm text-[#666666] mt-4 flex justify-between">
        <router-link to="/resetpwd">
          忘记密码
        </router-link>
        <router-link to="/register">
          注册
        </router-link>
      </div>

      <!-- 登录按钮 -->
      <div class="mt-6">
        <van-button class="w-full" round type="primary" @click="handleLogin">
          登录
        </van-button>
      </div>

      <!-- 协议勾选 -->
      <div class="text-xs text-gray-500 mt-4 flex items-center">
        <van-checkbox v-model="agreeProtocol" shape="round" icon-size="12" />
        <span class="ml-2" @click="agreeProtocol = !agreeProtocol">登录即表示同意<a
          target="_blank"
          href="https://www.d-xilzd.com/userProtocol.html" class="text-blue-600" @click.stop=""
        >《服务条款》</a>和<a
          target="_blank" href="https://www.d-xilzd.com/features.html" class="text-blue-600"
          @click.stop=""
        >《隐私协议》</a></span>
      </div>

      <!-- 验证码登录 -->
      <div class="text-sm mt-16 flex items-center justify-center" @click="router.push('/codeLogin')">
        <div class="flex flex-col items-center justify-center">
          <van-icon class="mb-2" name="chat-o" color="rgb(255, 107, 0)" size="28" />
          <div class="text-[#666666]">
            验证码登录
          </div>
        </div>
      </div>

      <!-- 区号选择弹窗 -->
      <van-popup v-model:show="showAreaSelect" position="bottom" :style="{ height: '310px' }">
        <van-picker
          show-toolbar title="选择区号" :columns="areaList" @confirm="confirmAreaSelect"
          @cancel="showAreaSelect = false" @change="handleAreaChange"
        />
      </van-popup>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-field__left-icon) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.van-field__control) {
  font-size: 16px !important;
}
</style>
