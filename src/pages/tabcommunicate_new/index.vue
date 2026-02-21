<script setup lang="ts">
import router from '@/router'
import { TUIContact } from '../../TUIKit/components'
</script>

<template>
  <div class="hehe">
    <div class="text-18px text-white font-700 pb-5px pt-10px text-center bg-[#0256FF] flex items-center justify-center relative">
      通讯录
    </div>
    <div class="home-TUIKit-main">
      <TUIContact display-type="contactList" @jumptoindexpage="router.push('/')" />
    </div>
  </div>
</template>

<style scoped>
.hehe {
  --tabbar-height: 60px;
  /* 这里设置你的 tabbar 高度 */

  height: calc(100vh - var(--tabbar-height));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* 禁止滚动 */
}

.header {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.home-TUIKit-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  /* 禁止滚动 */
  display: flex;
  flex-direction: column;
}

/* 确保 TUIContact 组件内部也占满空间并禁止滚动 */
.home-TUIKit-main :deep(.tui-contact) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-TUIKit-main :deep(.tui-contact-list) {
  flex: 1;
  overflow: hidden;
}

/* .van-cell {
  --van-cell-font-size: 15px;
} */
</style>

<route lang="json5">
{
  name: 'Communicate_new'
}
</route>
