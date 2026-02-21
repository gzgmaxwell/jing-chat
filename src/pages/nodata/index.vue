<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const query = route.query.url

const titleRef = computed(() => {
  if (query === 'dynamic')
    return '动态'
  else if (query === 'collect')
    return '收藏'
  return ''
})
</script>

<template>
  <div class="bg-[#f6f6f6] min-h-screen">
    <!-- 头部导航 -->
    <van-nav-bar :title="titleRef" left-arrow class="bg-white" @click-left="router.back()" />
    <div class="pt-10 flex justify-center">
      <img src="../../assets/icons/no_data.svg">
    </div>
    <div class="text-[#909399] pt-5 flex justify-center">
      暂无数据
    </div>
  </div>
</template>
