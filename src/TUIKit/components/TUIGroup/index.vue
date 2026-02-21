<script lang="ts" setup>
import {
  StoreName,
  TUIStore,
} from '@tencentcloud/chat-uikit-engine-lite'
import { ref } from '../../adapter-vue'

import CreateGroup from './create-group/index.vue'
import ManageGroup from './manage-group/index.vue'
import SelectMember from './select-member/index.vue'
import { usechatStore } from '@/stores'

const isShowCreateGroup = ref(false)
const isShowManageGroup = ref(false)
const isShowSelectMember = ref(false)

/* 跳转到添加群聊页面时隐藏tabbar逻辑 */
// 监听isShowCreateGroup变化
const chatStore = usechatStore()
watch(isShowCreateGroup, (newVal) => {
  chatStore.setAddGroupShow(newVal)
}, { immediate: true })
// 组件卸载时重置状态
onUnmounted(() => {
  chatStore.setAddGroupShow(false)
})

TUIStore.watch(StoreName.GRP, {
  isShowCreateComponent: (data: any) => {
    if (data) {
      isShowCreateGroup.value = true
    }
    else {
      isShowCreateGroup.value = false
    }
  },
  isShowManageComponent: (data: any) => {
    if (data) {
      isShowManageGroup.value = true
    }
    else {
      isShowManageGroup.value = false
    }
  },
  isShowSelectComponent: (data: any) => {
    if (data) {
      isShowSelectMember.value = true
    }
    else {
      isShowSelectMember.value = false
    }
  },
})
</script>

<template>
  <div :class="[(isShowCreateGroup || isShowManageGroup || isShowSelectMember) && 'tui-group']">
    <CreateGroup v-if="isShowCreateGroup" />
    <ManageGroup v-if="isShowManageGroup" />
    <SelectMember v-if="isShowSelectMember" />
  </div>
</template>

<style lang="scss" scoped>
.tui-group {
  width: 100%;
  height: 100%;
}
</style>
