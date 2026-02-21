<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { showNotify } from 'vant'
import { ResCode } from '@/utils/const'
import { transferMethod } from '@/api/transfer'
import { rsaEncrypt } from '@/utils/jsencryptUtil'
import QrScanner from '@/components/QrScanner/index.vue'

const { copy, isSupported } = useClipboard()
const onClickLeft = () => router.back()
const route = useRoute()
const address = ref(route.query.data ? route.query.data : '')
const amountInput = ref('')
const amountInputTip = 'THTMWadZMPmznc1Q2JAmthhzpGHNHkxrdE'
const payPassword = ref(false)
const zfmm = ref('')
const showQrCodeReader = ref(false)
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
  console.warn('address.value11111', address.value)
  // if (!address.value) {
  //   showNotify({ type: "warning", message: "请输入接收地址" });
  //   return;
  // }
  // const num = parseFloat(amountInput.value);
  // if (isNaN(num) || num < 1 || num > 500000) {
  //   showNotify({ type: "warning", message: "数量不在有效范围" });

  //   return;
  // }
  payPassword.value = true
}
function onSubmitBtn() {
  if (!zfmm.value) {
    showNotify({ type: 'warning', message: '请输入支付密码' })
    return
  }
  const sellData = {
    money: amountInput.value.trim(), // 金额
    zfmm: rsaEncrypt(zfmm.value.trim()) as string, // 支付密码
    address: address.value,
  }
  transferMethod(sellData).then((res) => {
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
    await copy(amountInputTip)
    showToast('订单编号已复制')
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
      <van-cell-group>
        <div class="moneyBox">
          <div class="text-14px mb-2" style="color: #000">
            付款金额
          </div>
          <van-field v-model="address" style="border-bottom: 1px solid #ebebeb">
            <template #left-icon style="margin-left: -16px">
              <img
                src="../../assets/pay/rmb.png"
                width="18"
                alt="图标"
                style="padding-top: 5px"
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
            v-model="amountInputTip"
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
      <div class="text-center">
        <h1 class="font-bold mb-4">
          请输入支付密码
        </h1>
        <div>{{ amountInput }} GUB</div>
      </div>
      <van-divider
        :style="{
          padding: '0',
          borderColor: '#E5E5E5',
          height: '4px',
          margin: '8px 0',
        }"
      />
      <van-cell-group>
        <div class="text-14px mb-2">
          支付密码
        </div>
        <van-field
          v-model="zfmm"
          placeholder="输入支付密码"
          class="mb-6 rounded-lg bg-[#F7F8FA]"
        />
      </van-cell-group>

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
