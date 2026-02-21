<script setup lang="ts">
import { addPayMethod } from '@/api/paymethod'
import type { AddPayMethod } from '@/api/paymethod'
import router from '@/router'
import { ResCode } from '@/utils/const'

/* -------------------------------------------------------------------------- */
/*                                  表单数据                                   */
/* -------------------------------------------------------------------------- */
const formData = ref<AddPayMethod>({ payType: '3', name: '', bankCardNumber: '', bankName: '' })

const showBankPicker = ref(false)
const bankColumns = [
  { text: '农业银行', value: 'ABC' },
  { text: '工商银行', value: 'ICBC' },
  { text: '建设银行', value: 'CCB' },
  { text: '招商银行', value: 'CMB' },
]

/* -------------------------------------------------------------------------- */
/*                                  事件处理                                   */
/* -------------------------------------------------------------------------- */
const onClickLeft = () => router.back()

function onConfirmBank({ selectedOptions }: any) {
  formData.value.bankName = selectedOptions[0]?.text
  showBankPicker.value = false
}

function onSubmit() {
  if (formData.value.name.trim().length <= 0) {
    showToast('请填写姓名')
    return
  }
  if (formData.value.bankCardNumber.trim().length <= 0) {
    showToast('请选择银行')
    return
  }
  if (formData.value.bankName.trim().length <= 0) {
    showToast('请填写银行账号/卡号')
    return
  }
  formData.value = {
    ...formData.value,
  }
  addPayMethod(formData.value).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      showToast('添加成功')
      router.back()
    }
  })
}
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <!-- 1. 固定头部 -->
    <van-nav-bar title="添加银行卡" left-arrow :border="false" class="flex-shrink-0" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="24" color="#000" />
      </template>
      <template #title>
        <span class="text-xl text-black font-bold">添加银行卡</span>
      </template>
    </van-nav-bar>

    <!-- 2. 可滚动内容区域 -->
    <div class="p-5 flex-1 overflow-y-auto">
      <div class="space-y-6">
        <!-- 姓名 -->
        <div class="space-y-2">
          <div class="text-base text-gray-900 font-medium">
            姓名
          </div>
          <input
            v-model="formData.name" type="text" placeholder="请输入姓名"
            class="text-gray-900 px-4 py-3 outline-none rounded-lg bg-gray-100 w-full placeholder-gray-400"
          >
        </div>

        <!-- 银行名称 -->
        <div class="space-y-2">
          <div class="text-base text-gray-900 font-medium">
            银行名称
          </div>
          <div
            class="text-gray-500 px-4 py-3 rounded-lg bg-gray-100 flex items-center justify-between active:bg-gray-200"
          >
            <input v-model="formData.bankName" type="text" placeholder="点击选择银行或输入自定义银行名称" class="text-gray-900">
            <van-icon name="arrow-down" color="#999" @click="showBankPicker = true" />
          </div>
        </div>

        <!-- 银行卡号 -->
        <div class="space-y-2">
          <div class="text-base text-gray-900 font-medium">
            添加银行卡号
          </div>
          <input
            v-model="formData.bankCardNumber" type="text" placeholder="请输入银行账号/卡号"
            class="text-gray-900 px-4 py-3 outline-none rounded-lg bg-gray-100 w-full placeholder-gray-400"
          >
        </div>

        <!-- 特别提示 -->
        <div class="p-4 rounded-lg bg-gray-100">
          <div class="text-base text-gray-900 font-bold mb-1">
            特别提示
          </div>
          <div class="text-sm text-gray-500 leading-relaxed">
            请确保添加您的银行卡号以进行即时收付款。请勿包含其他银行 或付款方式的详细信息。您必须添加所选银行的付款/收款信息。
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 固定底部按钮 -->
    <div class="px-5 pb-8 pt-2 bg-white flex-shrink-0">
      <button
        class="text-base text-white font-medium py-3.5 rounded-lg bg-[#0052D9] w-full active:bg-blue-700"
        @click="onSubmit"
      >
        确认
      </button>
    </div>

    <!-- 银行选择弹窗 -->
    <van-popup v-model:show="showBankPicker" round position="bottom">
      <van-picker :columns="bankColumns" @cancel="showBankPicker = false" @confirm="onConfirmBank" />
    </van-popup>
  </div>
</template>

<style scoped>
/* 覆盖 Vant NavBar 样式以匹配设计稿 */
:deep(.van-nav-bar__title) {
  font-weight: 700;
}
</style>
