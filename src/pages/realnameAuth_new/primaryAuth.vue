<script setup lang="ts">
import router from '@/router'
import { closeToast, showLoadingToast, showToast } from 'vant'
import { addRealNameAuthApi } from '@/api/realNameAuthApi'
import type { RealNameAuthData } from '@/api/realNameAuthApi'
import { ResCode } from '@/utils/const'

const isViewMode = ref(false)
const formData = ref<RealNameAuthData>({
  name: '', // 姓名
  idNumber: '', // 身份证号
  sfzZm: '', // 身份证正面
  sfzFm: '', // 身份证反面
  level: '1', // 初级认证
})
// const fileList = ref({ front: [] as any[], back: [] as any[] })

// 提交按钮
const btnLoading = ref(false)
function onSubmit() {
  if (!formData.value.name.trim()) {
    return showToast('请输入姓名')
  }
  if (!formData.value.idNumber.trim()) {
    return showToast('请输入身份证号码')
  }
  if (!formData.value.sfzZm) {
    return showToast('请上传身份证人像面')
  }
  if (!formData.value.sfzFm) {
    return showToast('请上传身份证国徽面')
  }

  addRealNameAuthApi(formData.value).then((res) => {
    btnLoading.value = true
    if (res.code === ResCode.SUCCESS) {
      // 无论成功失败都关闭loading
      // closeToast()
      showToast('认证成功')
      router.back()
    }
    btnLoading.value = false
  })
}

// 获取人像面图片url
const sfzFm = ref('')
function getImgUrl(url: string) {
  formData.value.sfzZm = url
}
// 获取国徽面图片url
const sfzZm = ref('')
function getImgUrl1(url: string) {
  formData.value.sfzFm = url
}
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="router.back()">
      <template #title>
        <span class="text-lg text-black font-bold">初级实名认证</span>
      </template>
    </van-nav-bar>

    <div class="p-4 pb-24 flex-1 overflow-y-auto">
      <div class="text-12px text-[#8A8A8D] mb-6">
        为保证您的账号安全，请先完成实名认证
      </div>

      <!-- 姓名 -->
      <div class="mb-4">
        <div class="text-gray-900 font-bold mb-2">
          姓名
        </div>
        <input
          v-model="formData.name" type="text" placeholder="请输入你的姓名"
          class="px-4 py-3 outline-none rounded-lg bg-[#ECF1F7] w-full placeholder-[#8A8A8D]"
        >
        <!-- <van-field v-model="formData.realName" name="realName" placeholder="请输入你的姓名"
          :rules="[{ required: true, message: '请输入姓名' }]" class="rounded-lg bg-[#F0F4F8] flex h-12 items-center"
          :border="false" /> -->
      </div>

      <!-- 身份证号 -->
      <div class="mb-6">
        <div class="text-gray-900 font-bold mb-2">
          身份证号
        </div>
        <input
          v-model="formData.idNumber" type="text" placeholder="请输入身份证号码"
          class="px-4 py-3 outline-none rounded-lg bg-[#ECF1F7] w-full placeholder-[#8A8A8D]"
        >
        <!-- <van-field
          v-model="formData.idCard" name="idCard" placeholder="请输入身份证号码"
          :rules="[{ required: true, message: '请输入身份证号' }]" class="rounded-lg bg-[#F0F4F8] flex h-12 items-center"
          :border="false"
        /> -->
      </div>

      <!-- 上传身份证 -->
      <div class="mb-4">
        <div class="text-gray-900 font-bold mb-4">
          上传身份证
        </div>
        <div class="flex gap-5 w-full">
          <!-- 人像面 -->
          <real-name-auth-uploader v-model="sfzZm" content="上传身份证人像面" @get-img-url="getImgUrl" />
          <!-- <van-uploader
            v-model="fileList.front" :max-count="1" :deletable="!isViewMode" :disabled="isViewMode"
            class="flex-1" preview-size="100%"
          >
            <template #default>
              <div
                class="border border-gray-400 rounded-[6px] border-dashed bg-[#F0F4F8] flex flex-col w-full aspect-[8/5] items-center justify-center"
              >
                <div class="mb-2 rounded-full bg-white flex h-50px w-50px items-center justify-center">
                  <img :src="camera" class="h-[25px] w-[25px] object-contain" alt="icon">
                </div>
                <span class="text-xs text-blue-600">上传身份证人像面</span>
              </div>
            </template>
          </van-uploader> -->

          <!-- 国徽面 -->
          <real-name-auth-uploader v-model="sfzFm" content="上传身份证国徽面" @get-img-url="getImgUrl1" />
          <!-- <van-uploader
            v-model="fileList.back" :max-count="1" :deletable="!isViewMode" :disabled="isViewMode"
            class="flex-1" preview-size="100%"
          >
            <template #default>
              <div
                class="border border-gray-400 rounded-[6px] border-dashed bg-[#F0F4F8] flex flex-col w-full aspect-[8/5] items-center justify-center"
              >
                <div class="mb-2 rounded-full bg-white flex h-50px w-50px items-center justify-center">
                  <img :src="camera" class="h-[25px] w-[25px] object-contain" alt="icon">
                </div>
                <span class="text-xs text-blue-600">上传身份证国徽面</span>
              </div>
            </template>
          </van-uploader> -->
        </div>
      </div>
      <!-- 底部按钮 -->
      <div v-if="!isViewMode" class="mt-40px bg-white bottom-0 left-0 right-0">
        <van-button
          :loading="btnLoading" loading-text="认证中..." block type="primary" color="#0052ff"
          class="text-base rounded-6px h-12" @click="onSubmit"
        >
          提交实名信息
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 覆盖 van-field 默认内边距以匹配设计图 */
:deep(.van-field__control) {
  color: #333;
}

:deep(.van-uploader__wrapper) {
  display: block;
}
</style>
