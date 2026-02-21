<script setup lang="ts">
import router from '@/router'
import { ref } from 'vue'

// 表单数据
const formData = ref({
  name: '',
  idCard: '',
  phone: '',
})

// 提交表单逻辑
function submitForm() {
  // 这里可以添加表单验证和接口请求逻辑
}
</script>

<template>
  <div class="bg-[#f6f6f6] min-h-screen">
    <!-- 头部导航 -->
    <van-nav-bar title="实名认证" left-arrow class="bg-white" @click-left="router.back()" />
    <!-- 表单区域 -->
    <div class="p-3">
      <van-form class="rounded-xl bg-white">
        <!-- 姓名输入 -->
        <div class="text-14px text-[#666] pl-16px pt-20px">
          真实姓名
        </div>
        <van-field v-model="formData.name" placeholder="请输入您的姓名" class="mb-4" />
        <!-- 身份证号输入 -->
        <div class="text-14px text-[#666] pl-16px">
          身份证号
        </div>
        <van-field v-model="formData.idCard" placeholder="请输入您的身份证号码" class="mb-4" />
        <!-- 手机号输入 -->
        <div class="text-14px text-[#666] pl-16px">
          手机号
        </div>
        <van-field v-model="formData.phone" placeholder="请输入您的手机号码" type="tel" />
        <!-- 提交按钮 -->
      </van-form>
    </div>
    <div class="pl-6 pr-6 pt-2">
      <van-button type="primary" round block @click="submitForm">
        实名认证
      </van-button>
    </div>
  </div>
</template>
