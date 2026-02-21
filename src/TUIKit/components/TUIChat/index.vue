<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from '../../adapter-vue'
import type {
  IConversationModel,
  IMessageModel,
} from '@tencentcloud/chat-uikit-engine-lite'
import TUIChatEngine, {
  StoreName,
  TUIConversationService,
  TUIStore,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine-lite'
import type { ExtensionInfo } from '@tencentcloud/tui-core-lite'
import TUICore, { TUIConstants } from '@tencentcloud/tui-core-lite'
import ChatHeader from './chat-header/index.vue'
import MessageList from './message-list/index.vue'
import MessageInput from './message-input/index.vue'
import MultipleSelectPanel from './mulitple-select-panel/index.vue'
import Forward from './forward/index.vue'
import MessageInputToolbar from './message-input-toolbar/index.vue'
import {
  isApp,
  isMobile,
  isPC,
  isUniFrameWork,
  isWeChat,
} from '../../utils/env'
import type { ToolbarDisplayType } from '../../interface'
import TUIChatConfig from './config'

const emits = defineEmits(['closeChat'])

const groupID = ref(undefined)
const isGroup = ref(false)
const isNotInGroup = ref(false)
const notInGroupReason = ref<number>()
const currentConversationID = ref()
const isMultipleSelectMode = ref(false)
const inputToolbarDisplayType = ref<ToolbarDisplayType>('none')
const messageInputRef = ref()
const messageListRef = ref<InstanceType<typeof MessageList>>()
const headerExtensionList = ref<ExtensionInfo[]>([])
const featureConfig = TUIChatConfig.getFeatureConfig()

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdate,
  })
})

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversation: onCurrentConversationUpdate,
  })
  reset()
})

const isInputToolbarShow = computed<boolean>(() => {
  return isUniFrameWork ? inputToolbarDisplayType.value !== 'none' : true
})

const leaveGroupReasonText = computed<string>(() => {
  let text = ''
  switch (notInGroupReason.value) {
    case 4:
      text = TUITranslateService.t('TUIChat.您已被管理员移出群聊')
      break
    case 5:
      text = TUITranslateService.t('TUIChat.该群聊已被解散')
      break
    case 8:
      text = TUITranslateService.t('TUIChat.您已退出该群聊')
      break
    default:
      text = TUITranslateService.t('TUIChat.您已退出该群聊')
      break
  }
  return text
})

function reset() {
  TUIConversationService.switchConversation('')
}

function closeChat(conversationID: string) {
  emits('closeChat', conversationID)
  reset()
}

function insertEmoji(emojiObj: object) {
  messageInputRef.value?.insertEmoji(emojiObj)
}

function handleEditor(message: IMessageModel, type: string) {
  if (!message || !type)
    return
  switch (type) {
    case 'reference':
      // todo
      break
    case 'reply':
      // todo
      break
    case 'reedit':
      if (message?.payload?.text) {
        messageInputRef?.value?.reEdit(message?.payload?.text)
      }
      break
    default:
      break
  }
}

function handleGroup() {
  headerExtensionList.value[0].listener.onClicked({ groupID: groupID.value })
}

function changeToolbarDisplayType(type: ToolbarDisplayType) {
  inputToolbarDisplayType.value
    = inputToolbarDisplayType.value === type ? 'none' : type
  if (inputToolbarDisplayType.value !== 'none' && isUniFrameWork) {
    uni.$emit('scroll-to-bottom')
  }
}

function scrollToLatestMessage() {
  messageListRef.value?.scrollToLatestMessage()
}

function toggleMultipleSelectMode(visible?: boolean) {
  isMultipleSelectMode.value
    = visible === undefined ? !isMultipleSelectMode.value : visible
}

function mergeForwardMessage() {
  messageListRef.value?.mergeForwardMessage()
}

function oneByOneForwardMessage() {
  messageListRef.value?.oneByOneForwardMessage()
}

function updateUIUserNotInGroup(conversation: IConversationModel) {
  if (conversation?.operationType > 0) {
    headerExtensionList.value = []
    isNotInGroup.value = true
    /**
     * 4 - be removed from the group
     * 5 - group is dismissed
     * 8 - quit group
     */
    notInGroupReason.value = conversation?.operationType
  }
  else {
    isNotInGroup.value = false
    notInGroupReason.value = undefined
  }
}

function onCurrentConversationUpdate(conversation: IConversationModel) {
  updateUIUserNotInGroup(conversation)
  // return when currentConversation is null
  if (!conversation) {
    return
  }
  // return when currentConversationID.value is the same as conversation.conversationID.
  if (currentConversationID.value === conversation?.conversationID) {
    return
  }

  isGroup.value = false
  let conversationType = TUIChatEngine.TYPES.CONV_C2C
  const conversationID = conversation.conversationID
  if (conversationID.startsWith(TUIChatEngine.TYPES.CONV_GROUP)) {
    conversationType = TUIChatEngine.TYPES.CONV_GROUP
    isGroup.value = true
    groupID.value = conversationID.replace(TUIChatEngine.TYPES.CONV_GROUP, '')
  }

  headerExtensionList.value = []
  isMultipleSelectMode.value = false
  // Initialize chatType
  TUIChatConfig.setChatType(conversationType)
  console.log('聊天类型', conversationType)

  // While converstaion change success, notify callkit and roomkit、or other components.
  TUICore.notifyEvent(
    TUIConstants.TUIChat.EVENT.CHAT_STATE_CHANGED,
    TUIConstants.TUIChat.EVENT_SUB_KEY.CHAT_OPENED,
    { groupID: groupID.value },
  )
  // The TUICustomerServicePlugin plugin determines if the current conversation is a customer service conversation, then sets chatType and activates the conversation.
  TUICore.callService({
    serviceName: TUIConstants.TUICustomerServicePlugin.SERVICE.NAME,
    method:
      TUIConstants.TUICustomerServicePlugin.SERVICE.METHOD.ACTIVE_CONVERSATION,
    params: { conversationID },
  })
  // When open chat in room, close main chat ui and reset theme.
  if (TUIChatConfig.getChatType() === TUIConstants.TUIChat.TYPE.ROOM) {
    if (
      TUIChatConfig.getFeatureConfig(
        TUIConstants.TUIChat.FEATURE.InputVoice,
      ) === true
    ) {
      TUIChatConfig.setTheme('light')
      currentConversationID.value = ''
      return
    }
  }
  // Get chat header extensions
  if (TUIChatConfig.getChatType() === TUIConstants.TUIChat.TYPE.GROUP) {
    headerExtensionList.value = TUICore.getExtensionList(
      TUIConstants.TUIChat.EXTENSION.CHAT_HEADER.EXT_ID,
    )
  }
  TUIStore.update(StoreName.CUSTOM, 'activeConversation', conversationID)
  currentConversationID.value = conversationID
}
</script>

<template>
  <div class="chat" style="width: 100vw; max-width: 600px">
    <div class="tui-chat" :class="[!isPC && 'tui-chat-h5']">
      <div
        v-if="!currentConversationID"
        class="tui-chat-default"
        :class="[!isPC && 'tui-chat-h5-default']"
      >
        <slot />
      </div>
      <div
        v-if="currentConversationID"
        class="tui-chat"
        :class="[!isPC && 'tui-chat-h5']"
        style="display: flex; flex-direction: column; height: 100dvh"
      >
        <ChatHeader
          class="tui-chat-header"
          :class="[
            !isPC && 'tui-chat-H5-header',
            isUniFrameWork && 'tui-chat-uniapp-header',
          ]"
          :is-group="isGroup"
          :header-extension-list="headerExtensionList"
          @close-chat="closeChat"
          @open-group-management="handleGroup"
        />
        <Forward @toggle-multiple-select-mode="toggleMultipleSelectMode" />
        <MessageList
          ref="messageListRef"
          style="flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch"
          class="tui-chat-message-list"
          :class="[!isPC && 'tui-chat-h5-message-list']"
          :is-group="isGroup"
          :group-i-d="groupID"
          :is-not-in-group="isNotInGroup"
          :is-multiple-select-mode="isMultipleSelectMode"
          @handle-editor="handleEditor"
          @close-input-tool-bar="() => changeToolbarDisplayType('none')"
          @toggle-multiple-select-mode="toggleMultipleSelectMode"
        />
        <div
          v-if="isNotInGroup"
          class="tui-chat-leave-group"
          :class="{
            'tui-chat-leave-group-mobile': isMobile,
          }"
        >
          {{ leaveGroupReasonText }}
        </div>
        <MultipleSelectPanel
          v-else-if="isMultipleSelectMode"
          @one-by-one-forward-message="oneByOneForwardMessage"
          @merge-forward-message="mergeForwardMessage"
          @toggle-multiple-select-mode="toggleMultipleSelectMode"
        />
        <div v-else>
          <MessageInputToolbar
            v-if="isInputToolbarShow"
            class="tui-chat-message-input-toolbar"
            :class="[
              !isPC && 'tui-chat-h5-message-input-toolbar',
              isUniFrameWork && 'tui-chat-uni-message-input-toolbar',
            ]"
            :display-type="inputToolbarDisplayType"
            @insert-emoji="insertEmoji"
            @change-toolbar-display-type="changeToolbarDisplayType"
            @scroll-to-latest-message="scrollToLatestMessage"
          />
          <MessageInput
            ref="messageInputRef"
            :is-group="!!groupID"
            class="tui-chat-message-input"
            :class="[
              !isPC && 'tui-chat-h5-message-input',
              isUniFrameWork && 'tui-chat-uni-message-input',
              isWeChat && 'tui-chat-wx-message-input',
            ]"
            :enable-at="featureConfig.InputMention"
            :is-muted="false"
            :mute-text="TUITranslateService.t('TUIChat.您已被管理员禁言')"
            :placeholder="TUITranslateService.t('TUIChat.请输入消息')"
            :input-toolbar-display-type="inputToolbarDisplayType"
            @change-toolbar-display-type="changeToolbarDisplayType"
          />
        </div>
      </div>
      <!-- Group Management -->
      <div
        v-if="
          !isNotInGroup
            && !isApp
            && isUniFrameWork
            && isGroup
            && headerExtensionList.length > 0
        "
        class="group-profile"
        @click="handleGroup"
      >
        {{ headerExtensionList[0].text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./style/index.scss"></style>
