<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouteCacheStore } from '@/stores'
import VConsole from 'vconsole'

new VConsole()

const { t } = useI18n()

useHead({
  title: () => t('app.name'),
  meta: [
    {
      name: 'description',
      content: () => t('app.description'),
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#0B0A0A' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const routeCacheStore = useRouteCacheStore()

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
</script>

<template>
  <van-config-provider :theme="mode">
    <!-- <nav-bar /> -->
    <router-view v-slot="{ Component }">
      <!-- <section class="app-wrapper"> -->
      <section>
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 16px;
}
:deep(.van-field__control) {
  font-size: 16px !important;
}
</style>
