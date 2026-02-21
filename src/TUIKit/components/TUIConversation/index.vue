<script lang="ts" setup>
import { StoreName, TUIStore } from '@tencentcloud/chat-uikit-engine-lite'
import { ref } from '../../adapter-vue'
import ConversationList from './conversation-list/index.vue'
import ConversationHeader from './conversation-header/index.vue'
import ConversationNetwork from './conversation-network/index.vue'

const emits = defineEmits(['handleSwitchConversation'])

const totalUnreadCount = ref(0)
const headerRef = ref<typeof ConversationHeader>()
const isShowConversationHeader = ref<boolean>(true)

TUIStore.watch(StoreName.CONV, {
  totalUnreadCount: (count: number) => {
    totalUnreadCount.value = count
  },
})

TUIStore.watch(StoreName.CUSTOM, {
  isShowConversationHeader: (showStatus: boolean) => {
    isShowConversationHeader.value = showStatus !== false
  },
})

function handleSwitchConversation(conversationID: string) {
  emits('handleSwitchConversation', conversationID)
}

function handleClickConv() {
  headerRef?.value?.closeChildren()
}
</script>

<template>
  <div class="tui-conversation" @click="handleClickConv">
    <ConversationHeader v-if="isShowConversationHeader" ref="headerRef" />
    <ConversationNetwork />
    <ConversationList @handle-switch-conversation="handleSwitchConversation" />
  </div>
</template>

<style lang="scss" scoped src="./style/index.scss"></style>
