<script setup lang="ts">
import type {
  IConversationModel,
} from '@tencentcloud/chat-uikit-engine-lite'
import {
  StoreName,
  TUIStore,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine-lite'
import { computed, ref } from '../../../adapter-vue'
import MessageInputEditor from './message-input-editor.vue'
import MessageInputAt from './message-input-at/index.vue'
import MessageInputButton from './message-input-button.vue'
import MessageInputQuote from './message-input-quote/index.vue'
import { sendMessages, sendTyping } from '../utils/sendMessage'
import { transformTextWithEmojiNamesToKeys } from '../emoji-config'
import { isH5, isPC } from '../../../utils/env'
import AiRobotManager from '../aiRobotManager'
import Icon from '../../common/Icon.vue'
import breakBtnSvg from '../../../assets/icon/break-btn.svg'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'this is placeholder',
  },
  isMuted: {
    type: Boolean,
    default: true,
  },
  muteText: {
    type: String,
    default: '',
  },
  enableInput: {
    type: Boolean,
    default: true,
  },
  enableAt: {
    type: Boolean,
    default: true,
  },
  enableDragUpload: {
    type: Boolean,
    default: true,
  },
  enableTyping: {
    type: Boolean,
    default: true,
  },
  isGroup: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['sendMessage', 'resetReplyOrReference', 'onTyping'])
const editor = ref<InstanceType<typeof MessageInputEditor>>()
const messageInputAtRef = ref<InstanceType<typeof MessageInputAt>>()
const currentConversation = ref<IConversationModel>()
const robotStreamingStatus = ref<Record<string, boolean>>({})

AiRobotManager.onSteamingStatusChange((option?: Record<string, boolean>) => {
  robotStreamingStatus.value = option || {}
})

TUIStore.watch(StoreName.CONV, {
  currentConversation: (conversation: IConversationModel) => {
    currentConversation.value = conversation
  },
})

const isRobotStreaming = computed(() => {
  if (currentConversation.value?.conversationID) {
    return robotStreamingStatus.value[currentConversation.value?.conversationID] || false
  }
  return false
})

function onTyping(inputContentEmpty: boolean, inputBlur: boolean) {
  sendTyping(inputContentEmpty, inputBlur)
}

function onAt(show: boolean) {
  messageInputAtRef.value?.toggleAtList(show)
}

function sendBreakMessage() {
  AiRobotManager.sendBreakConversation(currentConversation.value?.conversationID || '')
}

async function sendMessage(type: string = 'text') {
  console.log('sendMessage顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶')
  // 根据isGroup来判断是否是群聊还是单聊，修复单聊报错问题

  if (isRobotStreaming.value && type === 'enter') {
    return
  }

  if (isRobotStreaming.value) {
    return sendBreakMessage()
  }

  const _editorContentList = editor.value?.getEditorContent() as any[]
  if (!_editorContentList || !currentConversation.value)
    return
  const editorContentList = _editorContentList.map((editor: any) => {
    if (editor.type === 'text') {
      editor.payload.text = transformTextWithEmojiNamesToKeys(editor.payload.text)
    }
    return editor
  })
  await sendMessages(
    editorContentList,
    currentConversation.value,
    props.isGroup,
  )
  emit('sendMessage')
  editor.value?.resetEditor()
}

function insertEmoji(emoji: any) {
  editor.value?.addEmoji(emoji)
}

function onAtListOpen() {
  if (isH5) {
    editor.value?.blur()
  }
}

function insertAt(atInfo: any) {
  editor?.value?.insertAt && editor?.value?.insertAt(atInfo)
}

function reEdit(content: any) {
  editor.value?.resetEditor()
  editor.value?.setEditorContent(content)
}

defineExpose({
  insertEmoji,
  reEdit,
})
</script>

<template>
  <div class="message-input-wrapper">
    <div class="message-input-container" :class="[!isPC && 'message-input-container-h5']">
      <MessageInputEditor
        ref="editor"
        :placeholder="props.placeholder"
        :is-muted="props.isMuted"
        :mute-text="props.muteText"
        :enable-input="props.enableInput"
        :enable-at="props.enableAt"
        :enable-typing="props.enableTyping"
        :enable-drag-upload="props.enableDragUpload"
        @send-message="sendMessage"
        @on-typing="onTyping"
        @on-at="onAt"
      />
      <MessageInputButton
        v-if="!props.isMuted && !isRobotStreaming"
        @send-message="sendMessage"
      />
      <MessageInputButton
        v-if="isRobotStreaming"
        class-name="break-btn"
        :hover-text="TUITranslateService.t('TUIChat.停止回答')"
        @send-message="sendBreakMessage"
      >
        <Icon
          :file="breakBtnSvg"
          class="icon"
        />
      </MessageInputButton>
      <MessageInputAt
        v-if="props.enableAt"
        ref="messageInputAtRef"
        @insert-at="insertAt"
        @on-at-list-open="onAtListOpen"
      />
    </div>
    <MessageInputQuote />
  </div>
</template>

<style lang="scss">
@import '../../../assets/styles/common';

.message-input-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.message-input-container {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: none;
  overflow: hidden;
}

.message-input-container-h5 {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
}
.break-btn {
  background: none !important;
}
</style>
