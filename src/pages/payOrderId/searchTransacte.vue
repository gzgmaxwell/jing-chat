
<template>
  <div class="font-sans flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">查找交易</span>
      </template>
    </van-nav-bar>
    <div class="flex " style="padding: 0 16px; " >
      <van-field v-model="keywords" placeholder="查找" class="mb-10px rounded-lg bg-[#F7F8FA] " style="width: 86%;">
        <template #left-icon>
          <van-icon name="search" />
          <!-- 或者自定义svg -->
        </template>
      </van-field>
     <div class="mt-8px ml-8px" style="color: #0256FF;" @click="onClickLeft"> 取消</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";

const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const keywords = ref('')
</script>

<style lang="scss" scoped>
:deep(.van-cell) {
  background: #ecf1f7;
}
</style>