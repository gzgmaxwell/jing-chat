<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import { showConfirmDialog } from 'vant'

const userStore = useUserStore()

function logout() {
  showConfirmDialog({
    title: '标题',
    message:
      '确定要退出登录吗？',
  }).then(() => {
    userStore.logout()
  }).catch(() => {
  })
}

// 退出登录
</script>

<template>
  <van-nav-bar left-arrow title="设置" @click-left="router.back()" />
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="聊天设置" is-link />
  </van-cell-group>
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="安全设置" is-link />
    <van-cell title="隐私设置" is-link />
  </van-cell-group>
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="通知设置" is-link />
  </van-cell-group>
  <van-cell-group class="mt-3 rounded-lg bg-white">
    <van-cell title="注销账号" is-link />
  </van-cell-group>

  <div class="mt-10 pl-5 pr-5">
    <van-button class="w-full" round color="#fa5151" type="primary" @click="logout">
      退出登录
    </van-button>
  </div>
</template>

<style scoped>
:deep(.van-cell__title) {
  font-size: 17px;
}
</style>

<!-- <script setup lang="ts">
import { showConfirmDialog } from 'vant'
import router from '@/router/index'
import { useUserStore } from '@/stores'
import { version } from '~root/package.json'

const { t } = useI18n()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

function Logout() {
  showConfirmDialog({
    title: t('settings.confirmTitle'),
  })
    .then(() => {
      userStore.logout()
      router.push({ name: 'Home' })
    })
    .catch(() => {})
}
</script>

<template>
  <div class="text-center">
    <VanCellGroup :inset="true">
      <van-cell v-if="userInfo.uid" :title="$t('settings.logout')" clickable class="van-text-color" @click="Logout" />
    </VanCellGroup>

    <div class="text-gray mt-2">
      {{ $t("settings.currentVersion") }}: v{{ version }}
    </div>
  </div>
</template>

<style scoped>
.van-text-color {
  --van-cell-text-color: var(--van-red);
}
</style>

<route lang="json5">
{
  name: 'Settings'
}
</route> -->
