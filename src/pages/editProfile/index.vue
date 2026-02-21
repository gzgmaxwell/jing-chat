<script setup lang="ts">
import router from '@/router'

const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')))

const gender = computed(() => {
  if (userInfo.value.gender === 0)
    return '男'
  else if (userInfo.value.gender === 0)
    return '女'
  return '未设置'
})
// 退出登录
</script>

<template>
  <van-nav-bar left-arrow title="详细资料" @click-left="router.back()" />
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="头像" is-link>
      <template #value>
        <img
          :src="userInfo.avatar || '../../assets/icons/my_svg/avatar_default.svg'"
          class="rounded-12px h-48px w-48px"
        >
      </template>
    </van-cell>
    <van-cell title="昵称" is-link>
      <template #value>
        {{ userInfo.nickName }}
      </template>
    </van-cell>
    <van-cell title="账号">
      <template #value>
        {{ userInfo.onlyCode }}
      </template>
    </van-cell>
    <van-cell title="手机号" />
  </van-cell-group>
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="个性签名" is-link>
      <template #value>
        <div class="max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden">
          {{ userInfo.slogan }}
        </div>
      </template>
    </van-cell>
    <van-cell title="性别" is-link>
      <template #value>
        {{ gender }}
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
:deep(.van-cell__title) {
  font-size: 17px;
}
</style>
