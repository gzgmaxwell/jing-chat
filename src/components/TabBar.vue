<script setup lang="ts">
import { rootRouteList } from '@/config/routes'
import message from '../assets/tabbar_new/message.png'
import message_active from '../assets/tabbar_new/message_active.png'
import communicate from '../assets/tabbar_new/communicate.png'
import communicate_active from '../assets/tabbar_new/communicate_active.png'
import call from '../assets/tabbar_new/call.png'
import call_active from '../assets/tabbar_new/call_active.png'
import my from '../assets/tabbar_new/my.png'
import my_active from '../assets/tabbar_new/my_active.png'
import { onMounted, ref, watch } from 'vue'
import { usechatStore } from '@/stores'
import { useRoute } from 'vue-router'

const route = useRoute()
const chatStore = usechatStore()

const active = ref(0)

watch(
  () => route.path,
  (newPath) => {
    switch (newPath) {
      case '/':
        active.value = 0
        break
      case '/tabcommunicate_new':
        active.value = 1
        break
      case '/tabcall_new':
        active.value = 2
        break
      case '/my_new':
        active.value = 3
        break
    }
  },
  { immediate: true },
)

const show = computed(() => {
  // “消息页面”如果在聊天页面，则不显示tabbar 逻辑
  if (chatStore.isInChatPage) {
    return false
  }
  // “单聊群聊弹框”如果弹出，则不显示tabbar 逻辑
  if (chatStore.isDanliaoquanliaoDialogShow) {
    return false
  }
  // 添加群聊
  if (chatStore.isAddGroupShow) {
    return false
  }

  if (route.name && rootRouteList.includes(route.name)) {
    return true
  }
  return false
})
</script>

<template>
  <!-- 新需求 -->
  <van-tabbar
    v-if="show"
    v-model="active"
    route
    placeholder
    active-color="#0256FF"
    inactive-color="#8A8A8D"
  >
    <van-tabbar-item replace to="/">
      {{ $t("tabbar.message_new") }}
      <template #icon>
        <van-image
          v-if="active === 0"
          :src="message_active"
          class="imageIcon"
        />
        <van-image v-else :src="message" class="imageIcon" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/tabcommunicate_new">
      {{ $t("tabbar.communicate_new") }}
      <template #icon>
        <van-image
          v-if="active === 1"
          :src="communicate_active"
          class="imageIcon"
        />
        <van-image v-else :src="communicate" class="imageIcon" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/tabcall_new">
      {{ $t("tabbar.call_new") }}
      <template #icon>
        <van-image
          v-if="active === 2"
          :src="call_active"
          class="imageIcon"
        />
        <van-image v-else :src="call" class="imageIcon" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/my_new">
      {{ $t("tabbar.my_new") }}
      <template #icon>
        <van-image
          v-if="active === 3"
          :src="my_active"
          class="imageIcon"
        />
        <van-image v-else :src="my" class="imageIcon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>

  <!-- 旧需求 -->
  <!-- <van-tabbar v-if="show" v-model="active" route placeholder active-color="#0256FF" inactive-color="#8A8A8D">
    <van-tabbar-item replace to="/">
      {{ $t('tabbar.main') }}
      <template #icon>
        <van-image v-if="active === 0" :src="home_active" width="18px" height="18px" />
        <van-image v-else :src="home" width="18px" height="18px" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/tabtrade">
      {{ $t('tabbar.trade') }}
      <template #icon>
        <van-image v-if="active === 1" :src="trade_active" width="18px" height="18px" />
        <van-image v-else :src="trade" width="18px" height="18px" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/tabscan">
      {{ $t('tabbar.scan') }}
      <template #icon>
        <van-image v-if="active === 2" :src="scan" width="18px" height="18px" />
        <van-image v-else :src="scan" width="18px" height="18px" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/taborder">
      {{ $t('tabbar.order') }}
      <template #icon>
        <van-image v-if="active === 3" :src="order_active" width="18px" height="18px" />
        <van-image v-else :src="order" width="18px" height="18px" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/tabmy">
      {{ $t('tabbar.my') }}
      <template #icon>
        <van-image v-if="active === 4" :src="my_active" width="18px" height="18px" />
        <van-image v-else :src="my" width="18px" height="18px" />
      </template>
    </van-tabbar-item>
  </van-tabbar> -->
</template>

<style scoped lang="scss">
.imageIcon {
  max-width: 18px;
  max-height: 18px;
}
</style>
