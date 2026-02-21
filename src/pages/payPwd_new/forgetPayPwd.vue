<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

// TODO: 本地资源路径预留
const icons = {
  mobile: '/src/assets/icons/icon-mobile.png',
  shield: '/src/assets/icons/icon-shield.png',
  lock: '/src/assets/icons/icon-lock.png',
  eyeOpen: '/src/assets/icons/icon-eye-open.png',
  eyeClose: '/src/assets/icons/icon-eye-close.png',
}
const images = {
  sample: '/src/assets/images/auth-sample.png', // 手持证件示例图
}

const form = ref({ phone: '', code: '', pwd1: '', pwd2: '' })
const showPwd1 = ref(false)
const showPwd2 = ref(false)
const fileList = ref([])
const checked = ref(false)

const onClickLeft = () => history.back()
const sendCode = () => showToast('验证码已发送')

function onSubmit() {
  if (!checked.value)
    return showToast('请先勾选已阅读')
  if (!form.value.phone || !form.value.code)
    return showToast('请填写完整信息')
  if (fileList.value.length === 0)
    return showToast('请上传手持证件照')

  showToast({ type: 'success', message: '提交申请成功' })
}
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <!-- 1. 顶部导航 -->
    <van-nav-bar
      title="忘记支付密码"

      left-arrow

      placeholder fixed class="flex-none"
      @click-left="onClickLeft"
    />

    <!-- 2. 可滚动内容区 -->
    <div class="p-4 pb-32 flex-1 overflow-y-auto">
      <!-- 手机号 -->
      <div class="py-3 border-b border-gray-100 flex items-center">
        <img :src="icons.mobile" class="mr-2 opacity-60 h-5 w-5">
        <span class="text-gray-900 mr-2">+86</span>
        <van-icon name="arrow-down" color="#ccc" size="12" class="mr-3" />
        <input
          v-model="form.phone"
          type="tel"
          placeholder="输入手机号"
          class="text-base outline-none border-none bg-transparent flex-1"
        >
      </div>

      <!-- 验证码 -->
      <div class="mt-2 py-3 border-b border-gray-100 flex items-center">
        <img :src="icons.shield" class="mr-2 opacity-60 h-5 w-5">
        <input
          v-model="form.code"
          type="number"
          placeholder="输入验证码"
          class="text-base outline-none border-none bg-transparent flex-1"
        >
        <button
          class="text-sm text-blue-600 px-3 py-1 border border-blue-600 rounded bg-white active:bg-blue-50"
          @click="sendCode"
        >
          获取验证码
        </button>
      </div>

      <!-- 新支付密码 -->
      <div class="mt-2 py-3 border-b border-gray-100 flex items-center">
        <img :src="icons.lock" class="mr-2 opacity-60 h-5 w-5">
        <input
          v-model="form.pwd1"
          :type="showPwd1 ? 'text' : 'password'"
          placeholder="请输入支付密码"
          class="text-base outline-none border-none bg-transparent flex-1"
        >
        <div class="ml-2 px-2" @click="showPwd1 = !showPwd1">
          <img :src="showPwd1 ? icons.eyeOpen : icons.eyeClose" class="opacity-60 h-5 w-5">
        </div>
      </div>

      <!-- 确认支付密码 -->
      <div class="mb-6 mt-2 py-3 border-b border-gray-100 flex items-center">
        <img :src="icons.lock" class="mr-2 opacity-60 h-5 w-5">
        <input
          v-model="form.pwd2"
          :type="showPwd2 ? 'text' : 'password'"
          placeholder="请再次输入支付密码"
          class="text-base outline-none border-none bg-transparent flex-1"
        >
        <div class="ml-2 px-2" @click="showPwd2 = !showPwd2">
          <img :src="showPwd2 ? icons.eyeOpen : icons.eyeClose" class="opacity-60 h-5 w-5">
        </div>
      </div>

      <!-- 证件上传区域 -->
      <div class="mb-4 p-4 rounded-lg bg-gray-50">
        <div class="mb-3 flex gap-4">
          <!-- 上传按钮 -->
          <van-uploader v-model="fileList" :max-count="1" class="flex-1">
            <template #default>
              <div class="border border-blue-300 rounded-lg border-dashed bg-white flex flex-col w-full aspect-[4/3] items-center justify-center">
                <div class="mb-2 border border-blue-500 rounded-full flex h-10 w-10 items-center justify-center">
                  <van-icon name="arrow-up" color="#3b82f6" size="20" />
                </div>
                <span class="text-xs text-blue-500">上传手持证件照信息</span>
              </div>
            </template>
          </van-uploader>

          <!-- 示例图 -->
          <div class="border border-gray-200 rounded-lg bg-white flex flex-1 aspect-[4/3] items-center justify-center overflow-hidden">
            <img :src="images.sample" class="h-full w-full object-contain">
          </div>
        </div>

        <div class="text-xs text-gray-500 leading-relaxed">
          .请一手持认证证件，一手持白纸拍摄照片上传，白纸上需要书写<span class="text-red-500">申请当天日期和申请办理业务内容(重置支付密码)</span>
          <br>.证件上的信息不可进行修改和遮挡，必须看清证件号和姓名
          <br>.图片支持jpg、jpeg、png格式，文件小于10M
        </div>
      </div>

      <!-- 风险提示 -->
      <div class="text-xs text-gray-500 leading-relaxed p-3 rounded-lg bg-gray-100">
        <div class="text-red-500 mb-1">
          1.为保障您的资金安全，您的交易密码在24小时内暂停使用您将不能进行付款、转账、卖币等操作，可以正常进行买币操作。
        </div>
        <div>2.申请将于1个工作日内处理完毕，请保持手机通畅便于客服及时与您取得联系。</div>
        <div>3.申请结果会以短信或者邮件的形式发送通知。</div>
      </div>
    </div>

    <!-- 3. 底部固定区域 -->
    <div class="p-4 bg-white bottom-0 left-0 right-0 fixed z-10">
      <div class="mb-4 flex gap-2 cursor-pointer items-center" @click="checked = !checked">
        <div class="border border-gray-400 rounded-full flex h-4 w-4 items-center justify-center" :class="{ 'bg-blue-600 border-blue-600': checked }">
          <van-icon v-if="checked" name="success" color="white" size="10" />
        </div>
        <span class="text-sm text-gray-800">我已阅读并了解</span>
      </div>

      <van-button
        block
        type="primary"
        color="#0052ff"
        class="text-base rounded-lg h-11"
        @click="onSubmit"
      >
        确认
      </van-button>
    </div>
  </div>
</template>
