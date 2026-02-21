<script setup lang="ts">
import { addPayMethod } from '@/api/paymethod'
import type { AddPayMethod } from '@/api/paymethod'
import router from '@/router'
import { ResCode } from '@/utils/const'

/* -------------------------------------------------------------------------- */
/*                                  表单数据                                   */
/* -------------------------------------------------------------------------- */
const formData = ref<AddPayMethod>({ payType: '2', name: '', wxAccount: '', wxEwm: '' })

/* -------------------------------------------------------------------------- */
/*                                  事件处理                                   */
/* -------------------------------------------------------------------------- */
const onClickLeft = () => router.back()
const onRefresh = () => console.log('refresh')

function onSubmit() {
  if (formData.value.name.trim().length <= 0) {
    showToast('请填写姓名')
    return
  }
  if (formData.value.wxAccount.trim().length <= 0) {
    showToast('请填写微信账号')
    return
  }
  if (formData.value.wxEwm.trim().length <= 0) {
    showToast('请上传微信收款码')
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
// 获取图片url
function getImgUrl(url: string) {
  formData.value.wxEwm = url
}
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <!-- 1. 固定头部 -->
    <van-nav-bar :border="false" class="flex-shrink-0" @click-left="onClickLeft" @click-right="onRefresh">
      <template #left>
        <van-icon name="arrow-left" size="24" color="#000" />
      </template>
      <template #title>
        <span class="text-xl text-black font-bold">添加微信</span>
      </template>
      <template #right>
        <van-icon name="replay" size="24" color="#000" />
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

        <!-- 微信账号 -->
        <div class="space-y-2">
          <div class="text-base text-gray-900 font-medium">
            微信账号
          </div>
          <input
            v-model="formData.wxAccount" type="text" placeholder="请输入您的微信账号"
            class="text-gray-900 px-4 py-3 outline-none rounded-lg bg-gray-100 w-full placeholder-gray-400"
          >
        </div>

        <!-- 添加微信收款码 -->
        <div class="space-y-2">
          <div class="text-base text-gray-900 font-medium">
            添加微信收款码
          </div>
          <div class="flex">
            <PayMethodUploader @get-img-url="getImgUrl" />
          </div>
        </div>

        <!-- 特别提示 -->
        <div class="p-4 rounded-lg bg-gray-100">
          <div class="text-base text-gray-900 font-bold mb-2">
            特别提示
          </div>
          <div class="text-sm text-gray-500 leading-relaxed space-y-1">
            <p>微信收款码不能使用截屏图片，请根据以下步骤保存图片后 再上传：</p>
            <p>1.进入微信后，点击右下角的我</p>
            <p>2.点击进入支付</p>
            <p>3.点击进入上方的收付款</p>
            <p>4.点击页面中的二维码收款</p>
            <p>5.点击二维码下方的保存收款码</p>
            <p>6.然后到手机相册中找到微信保存的收款码即可</p>
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
  </div>
</template>

<style scoped>
:deep(.van-nav-bar__title) {
  font-weight: 700;
}
</style>
