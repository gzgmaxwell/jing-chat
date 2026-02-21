<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { validPhone } from '@/utils/regexUtils'
import { changePwd, getCaptcha, getPhoneCode } from '@/api/user'
import { ResCode } from '@/utils/const'
import { throttle } from 'lodash-es'
import { rsaEncrypt } from '@/utils/jsencryptUtil'

import phoneIcon from '@/assets/tabbar_new/login/phone.png'
import pwdIcon from '@/assets/tabbar_new/login/pwd.png'
import captchaIcon from '@/assets/tabbar_new/login/captcha.png'
import phonecodeIcon from '@/assets/tabbar_new/login/phonecode.png'

const router = useRouter()

const phoneAreaPrefix = ref('86')
const phoneNumber = ref('')
const password = ref('')
const passwordAgain = ref('')
const code = ref('')
const showPassword = ref(false)
const showPasswordAgain = ref(false)
const showAreaSelect = ref(false)
const isCounting = ref(false) // 是否倒计时
let timer = null
const countdown = ref(0)
const captcha = ref('') // 图形码
const captchaImg = ref('') // 图形

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

// 开始倒计时
async function startCountdown() {
  if (!!phoneNumber.value === false) {
    showToast('请输入手机号')
    return
  }
  if (captcha.value === '')
    queryCaptcha()
  if (captcha.value.trim() === '') {
    showToast('请输入图形验证码')
    return
  }
  const data = await getPhoneCode({
    vsCode: captcha.value,
    phoneNum: phoneNumber.value,
  })

  if (data?.code !== ResCode.SUCCESS)
    showToast(data?.msg)

  if (isCounting.value)
    return

  // 设置倒计时时间
  countdown.value = 5
  isCounting.value = true

  // 设置定时器
  timer = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      clearInterval(timer)
      isCounting.value = false
    }
  }, 1000)
}

// 计算按钮文本
function buttonText() {
  if (isCounting.value) {
    return `${countdown.value}s`
  }
  return '获取验证码'
}

// 确认修改
const confirmUpdateTh = throttle(confirmUpdate, 800)
async function confirmUpdate() {
  if (phoneNumber.value.trim() === '') {
    showToast('请输入手机号')
    return
  }
  if (!validPhone(phoneNumber.value.trim())) {
    showToast('请输入正确的手机号')
    return
  }
  if (password.value.trim() === '') {
    showToast('请输入密码')
    return
  }
  if (password.value.trim().length < 6) {
    showToast('密码不能少于6位')
    return
  }
  if (passwordAgain.value.trim() !== password.value.trim()) {
    showToast('两次输入的密码不一致')
    return
  }
  if (code.value.trim() === '') {
    showToast('请输入验证码')
    return
  }

  // 发请求
  const data = await changePwd({
    phoneNum: phoneNumber.value.trim(),
    authCode: code.value.trim(),
    newPassword: rsaEncrypt(password.value.trim()) as string,
  })
  if (data?.code === ResCode.SUCCESS) {
    showToast('密码修改成功，请重新登录')
    router.push('/login')
  }
}

// 进页面就获取captcha
queryCaptcha()
function queryCaptcha() {
  getCaptcha().then((res) => {
    captchaImg.value = URL.createObjectURL(res)
  })
}
// 选手机区号
</script>

<template>
  <van-nav-bar left-arrow @click-left="router.back()" />
  <div class="p-4 pt-5 bg-white flex min-h-screen justify-center">
    <div class="max-w-xs w-full">
      <h1 class="text-2xl font-bold mb-9 text-center">
        忘记密码
      </h1>
      <!-- 手机号输入 + 区号选择 -->
      <van-cell-group :border="false" class="border-b-1 border-b-[#E5E5E5]">
        <van-field v-model="phoneNumber" type="tel" label-width="35" placeholder="输入手机号">
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

      <!-- 新密码输入 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field
          v-model="password" :type="showPassword ? 'text' : 'password'" label-width="10" placeholder="输入新密码"
          :right-icon="showPassword ? 'eye-o' : 'closed-eye'" @click-right-icon="showPassword = !showPassword"
        >
          <template #left-icon>
            <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
        </van-field>
      </van-cell-group>

      <!-- 确认新密码 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field
          v-model="passwordAgain" :type="showPasswordAgain ? 'text' : 'password'" label-width="10"
          placeholder="确认新密码" :right-icon="showPasswordAgain ? 'eye-o' : 'closed-eye'"
          @click-right-icon="showPasswordAgain = !showPasswordAgain"
        >
          <template #left-icon>
            <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
        </van-field>
      </van-cell-group>

      <!-- 输入图形验证码 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field v-model="captcha" label-width="10" placeholder="输入图形验证码" left-icon="lock">
          <template #left-icon>
            <img :src="captchaIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
          <template #button>
            <van-image :src="captchaImg" class="h-8 w-25" @click="queryCaptcha" />
          </template>
        </van-field>
      </van-cell-group>

      <!-- 输入验证码 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field v-model="code" label-width="10" placeholder="输入验证码" left-icon="lock">
          <template #left-icon>
            <img :src="phonecodeIcon" class="h-[20px] w-[20px] object-contain" alt="icon">
          </template>
          <template #button>
            <van-button
              plain type="primary" size="small" :disabled="isCounting" class="pl-5 pr-5 rounded-lg h-10"
              @click="startCountdown"
            >
              {{ buttonText() }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 登录按钮 -->
      <div class="mt-6">
        <van-button class="w-full" round type="primary" @click="confirmUpdateTh">
          确认修改
        </van-button>
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
</style>
