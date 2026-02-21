<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { showNotify } from 'vant'
import { ResCode } from '@/utils/const'
import { order_recharge } from '@/api/payOrderId'
import { rsaEncrypt } from '@/utils/jsencryptUtil'
import QrScanner from '@/components/QrScanner/index.vue'

const { copy, isSupported } = useClipboard()
const onClickLeft = () => router.back()
const money = ref(undefined)
const address = ref('THTMWadZMPmznc1Q2JAmthhzpGHNHkxrdE')
const payPassword = ref(false)
const zfmm = ref('')
const showQrCodeReader = ref(false)
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  money.value = urlParams.get('money')
})
function onDecodeHandler(data) {
  if (data) {
    address.value = data
  }
  showQrCodeReader.value = false
}
function qrReaderClose() {
  showQrCodeReader.value = false
}

function onSubmit() {
  payPassword.value = true
}
function onSubmitBtn() {
  if (!zfmm.value) {
    showNotify({ type: 'warning', message: '请输入支付密码' })
    return
  }
  const urlParams = new URLSearchParams(window.location.search)
  const orderId: string = urlParams.get('id')
  const sellData = {
    orderId, // 订单ID
    zfmm: rsaEncrypt(zfmm.value.trim()) as string, // 支付密码
  }
  order_recharge(sellData).then((res) => {
    if (res.code === ResCode.SUCCESS)
      showToast('转账成功')
  })
}

// 复制订单编号
async function copyNum() {
  if (!isSupported) {
    showToast('您的浏览器不支持复制功能')
    return
  }
  try {
    await copy(address.value)
    showToast('地址已复制')
  }
  catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请重试')
  }
}
</script>

<template>
  <div class="bg-white flex flex-col min-h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar
      left-arrow
      placeholder
      fixed
      class="flex-none"
      @click-left="onClickLeft"
    >
      <template #title>
        <span class="text-lg text-black font-bold">付款</span>
      </template>
    </van-nav-bar>
    <div class="p-17px">
      <van-cell-group :border="false">
        <div class="moneyBox">
          <div class="text-14px mb-2" style="color: #000">
            付款金额
          </div>
          <van-field v-model="money" style="border-bottom: 1px solid #ebebeb" readonly>
            <template #left-icon style="margin-left: -16px">
              <img
                src="../../assets/pay/rmb.png"
                width="18"
                alt="图标"
                style="padding-top: 10px"
              >
            </template>
          </van-field>
        </div>
        <div class="adressBox">
          <div class="text-14px flex justify-between">
            <div class="mb-2" style="color: #000">
              地址
            </div>
          </div>
          <van-field
            v-model="address"
            class="mb-10px rounded-lg bg-[#F7F8FA]"
            readonly
          >
            <template #right-icon>
              <img
                src="../../assets/pay/copypay.png"
                width="18"
                alt="图标"
                style="padding-top: 3px"
                @click="copyNum"
              >
            </template>
          </van-field>
        </div>
      </van-cell-group>
      <div class="button-style" @click="onSubmit">
        <van-button block color="#0256FF" class="rounded-lg">
          确认转账
        </van-button>
      </div>
    </div>
    <QrScanner
      v-if="showQrCodeReader"
      @decode="onDecodeHandler"
      @close="qrReaderClose"
    />
    <van-popup
      v-model:show="payPassword"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
    >
      <div class="text-14px mb-2">
        支付密码
      </div>
      <van-field
        v-model="zfmm"
        placeholder="输入支付密码"
        class="mb-6 rounded-lg bg-[#F7F8FA]"
      />
      <div @click="onSubmitBtn">
        <van-button block color="#0256FF" class="rounded-lg">
          确认支付
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.moneyBox {
  :deep(.van-cell) {
    background: #fff !important;
  }
  :deep(.van-field__left-icon) {
    margin-left: -16px;
  }
}
.adressBox {
  margin-top: 20px;
  :deep(.van-cell) {
    background: #eaeff5 !important;
  }
  :deep(.van-field__control) {
    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 400;
    font-size: 12px;
    color: #8a8a8d;
  }
}
.button-style {
  position: absolute;
  bottom: 88px;
  width: 343px;
}

.submit-btn {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  height: 44px;
}
</style>
