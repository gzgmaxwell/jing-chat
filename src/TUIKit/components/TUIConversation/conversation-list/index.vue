<script lang="ts" setup>
import {
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from '../../../adapter-vue'
import type { IConversationModel } from '@tencentcloud/chat-uikit-engine-lite'
import TUIChatEngine, {
  ConversationModel,
  StoreName,
  TUIChatService,
  TUIConversationService,
  TUIStore,
  TUITranslateService,
} from '@tencentcloud/chat-uikit-engine-lite'
import {
  addLongPressListener,
  isIOS,
  TUIGlobal,
} from '@tencentcloud/universal-api'
import Icon from '../../common/Icon.vue'
import Avatar from '../../common/Avatar/index.vue'
import ActionsMenu from '../actions-menu/index.vue'
import muteIcon from '../../../assets/icon/mute.svg'
import { TUILogin } from '@tencentcloud/tui-core-lite'
import { genTestUserSig } from '../../../debug' // 从你本地拷贝的TUIKit目录引入
import { isH5, isMobile, isPC, isUniFrameWork } from '../../../utils/env'
import { filterKeyArr } from '../../../utils/util'
import TIM from 'tim-js-sdk'
import { useUserStore } from '@/stores'

interface IUserStatus {
  statusType: number
  customStatus: string
}

interface IUserStatusMap {
  [userID: string]: IUserStatus
}

const emits = defineEmits(['handleSwitchConversation', 'getPassingRef'])
const currentConversation = ref<IConversationModel>()
const currentConversationID = ref<string>()
const currentConversationDomRect = ref<DOMRect>()
const isShowOverlay = ref<boolean>(false)
const conversationList = ref<any>([])
const conversationListDomRef = ref<HTMLElement | undefined>()
const conversationListInnerDomRef = ref<HTMLElement | undefined>()
const actionsMenuPosition = ref<{
  top: number
  left: number | undefined
  conversationHeight: number | undefined
}>({
  top: 0,
  left: undefined,
  conversationHeight: undefined,
})
const userStore = useUserStore()
const displayOnlineStatus = ref(false)
const userOnlineStatusMap = ref<IUserStatusMap>()
const options = {
  SDKAppID: userStore.userInfo.sdkappid, // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
}
const tim = TIM.create(options)

async function login(userID: string, userSig: string) {
  try {
    await tim.login({ userID, userSig })
    console.warn('登录成功')
  }
  catch (error) {
    console.error('登录失败', error)
  }
}

const SDKAppID = userStore.userInfo.sdkappid // 替换成你的 SDKAppID
const secretKey = userStore.userInfo.key //
// 页面初始化或按钮事件中调用
const userID = userStore.userInfo.userId
const userSig = genTestUserSig({
  SDKAppID,
  secretKey,
  userID: userStore.userInfo.userId,
}).userSig

login(userID, userSig)

let lastestOpenActionsMenuTime: number | null = null

onMounted(() => {
  tim.on(TIM.EVENT.SDK_READY, () => {
    fetchConversationList()
  })

  TUIStore.watch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
    conversationList: onConversationListUpdated,
    currentConversation: onCurrentConversationUpdated,
  })
  TUIStore.watch(StoreName.USER, {
    displayOnlineStatus: onDisplayOnlineStatusUpdated,
    userStatusList: onUserStatusListUpdated,
  })

  if (!isUniFrameWork && isIOS && !isPC) {
    addLongPressHandler()
  }
})

onUnmounted(() => {
  TUIStore.unwatch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
    conversationList: onConversationListUpdated,
    currentConversation: onCurrentConversationUpdated,
  })

  TUIStore.unwatch(StoreName.USER, {
    displayOnlineStatus: onDisplayOnlineStatusUpdated,
    userStatusList: onUserStatusListUpdated,
  })
})

async function fetchConversationList() {
  try {
    const res = await tim.getConversationList()
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, (event) => {
      Array.from(event.data || [])
      console.warn('res.data.conversationList:', res.data.conversationList)
      console.warn('event.data:', event.data)
      console.warn('conversationList.value:', conversationList.value)
      event.data[0].userProfile.nick = userStore.userInfo.csName
      event.data[0].userProfile.avatar = userStore.userInfo.csHeader
      event.data[0].userProfile.userID = userStore.userInfo.csId
      conversationList.value = filterKeyArr(
        event.data,
        conversationList.value,
        'conversationID',
      )
      TUIStore.update(StoreName.CONV, 'conversationList', {
        conversationList: reactive(conversationList.value),
      })
    })

    // let promise = TUIChatService.getMessageList();
    // console.log(promise, "nnnnnn");
    // promise.catch(error => {
    //   // 调用异常时业务侧可以通过 promise.catch 捕获异常进行错误处理
    // });
  }
  catch (error) {
    console.error('获取会话列表失败', error)
  }
}

function onCurrentConversationUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation
}

function onConversationListUpdated(list: IConversationModel[]) {
  console.warn('conversationListconversationList', list)
  conversationList.value = list
}

function onCurrentConversationIDUpdated(id: string) {
  currentConversationID.value = id
}

function onDisplayOnlineStatusUpdated(status: boolean) {
  displayOnlineStatus.value = status
}

function getConversationAvatar(conversation: any) {
  if (conversation.getAvatar && typeof conversation.getAvatar === 'function') {
    return conversation.getAvatar()
  }

  // 处理 TIM 原生对象
  if (conversation.avatar) {
    return conversation.avatar
  }

  if (conversation.userProfile?.avatar) {
    return conversation.userProfile.avatar
  }

  if (conversation.groupProfile?.avatar) {
    return conversation.groupProfile.avatar
  }

  return ''
}

function getConversationName(conversation: any) {
  if (
    conversation.getShowName
    && typeof conversation.getShowName === 'function'
  ) {
    return conversation.getShowName()
  }

  if (conversation.name) {
    return conversation.name
  }

  if (conversation.userProfile?.nick) {
    return conversation.userProfile.nick
  }

  if (conversation.groupProfile?.name) {
    return conversation.groupProfile.name
  }

  return conversation.conversationID || ''
}

function getLastMessageText(conversation: any) {
  if (
    conversation.getLastMessage
    && typeof conversation.getLastMessage === 'function'
  ) {
    return conversation.getLastMessage('text')
  }

  if (conversation.lastMessage?.payload?.text) {
    return conversation.lastMessage.payload.text
  }

  return ''
}

function getLastMessageTime(conversation: any) {
  if (
    conversation.getLastMessage
    && typeof conversation.getLastMessage === 'function'
  ) {
    return conversation.getLastMessage('time')
  }

  if (conversation.lastMessage?.lastTime) {
    // 格式化时间
    const date = new Date(conversation.lastMessage.lastTime * 1000)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return ''
}
function isShowUserOnlineStatus(conversation: IConversationModel): boolean {
  return (
    displayOnlineStatus.value
    && conversation.type === TUIChatEngine.TYPES.CONV_C2C
  )
}

function showConversationActionMenu(
  event: Event,
  conversation: IConversationModel,
  index: number,
  isContextMenuEvent?: boolean,
) {
  if (isContextMenuEvent) {
    event.preventDefault()
    if (isUniFrameWork) {
      return
    }
  }
  currentConversation.value = conversation
  lastestOpenActionsMenuTime = Date.now()
  getActionsMenuPosition(event, index)
}

function closeConversationActionMenu() {
  // Prevent continuous triggering of overlay tap events
  if (
    lastestOpenActionsMenuTime
    && Date.now() - lastestOpenActionsMenuTime > 300
  ) {
    currentConversation.value = undefined
    isShowOverlay.value = false
  }
}

function getActionsMenuPosition(event: Event, index: number) {
  if (isUniFrameWork) {
    if (typeof conversationListDomRef.value === 'undefined') {
      emits('getPassingRef', conversationListDomRef)
    }
    const query = TUIGlobal?.createSelectorQuery().in(
      conversationListDomRef.value,
    )
    query
      .select(`#convlistitem-${index}`)
      .boundingClientRect((data) => {
        if (data) {
          actionsMenuPosition.value = {
            // The uni-page-head of uni-h5 is not considered a member of the viewport, so the height of the head is manually increased.
            top: data.bottom + (isH5 ? 44 : 0),
            // @ts-expect-error in uniapp event has touches property
            left: event.touches[0].pageX,
            conversationHeight: data.height,
          }
          isShowOverlay.value = true
        }
      })
      .exec()
  }
  else {
    const rect
      = (
        (event.currentTarget || event.target) as HTMLElement
      )?.getBoundingClientRect() || {}
    if (rect) {
      actionsMenuPosition.value = {
        top: rect.bottom,
        left: isPC ? (event as MouseEvent).clientX : undefined,
        conversationHeight: rect.height,
      }
    }
    isShowOverlay.value = true
  }
}

function enterConversationChat(conversationID: string) {
  emits('handleSwitchConversation', conversationID)
  TUIConversationService.switchConversation(conversationID)
}

function addLongPressHandler() {
  if (!conversationListInnerDomRef.value) {
    return
  }
  addLongPressListener({
    element: conversationListInnerDomRef.value,
    onLongPress: (event, target) => {
      const index = (
        Array.from(conversationListInnerDomRef.value!.children) as HTMLElement[]
      ).indexOf(target!)
      showConversationActionMenu(event, conversationList.value[index], index)
    },
    options: {
      eventDelegation: {
        subSelector: '.tui-conversation-content',
      },
    },
  })
}

function onUserStatusListUpdated(list: Map<string, IUserStatus>) {
  if (list.size !== 0) {
    userOnlineStatusMap.value = [...list.entries()].reduce(
      (obj, [key, value]) => {
        obj[key] = value
        return obj
      },
      {} as IUserStatusMap,
    )
  }
}
// Expose to the parent component and close actionsMenu when a sliding event is detected
defineExpose({ closeChildren: closeConversationActionMenu })
</script>

<template>
  <div ref="conversationListInnerDomRef" class="tui-conversation-list">
    <ActionsMenu
      v-if="isShowOverlay"
      :selected-conversation="currentConversation"
      :actions-menu-position="actionsMenuPosition"
      :selected-conversation-dom-rect="currentConversationDomRect"
      @close-conversation-action-menu="closeConversationActionMenu"
    />
    <div
      v-for="(conversation, index) in conversationList"
      :id="`convlistitem-${index}`"
      :key="index"
      class="tui-conversation-content"
      :class="[isMobile && 'tui-conversation-content-h5 disable-select']"
    >
      <div
        class="tui-conversation-item"
        :class="[
          isPC && 'isPC',
          currentConversationID === conversation.conversationID
            && 'tui-conversation-item-selected',
          conversation.isPinned && 'tui-conversation-item-pinned',
        ]"
        @click="enterConversationChat(conversation.conversationID)"
        @longpress="showConversationActionMenu($event, conversation, index)"
        @contextmenu="
          showConversationActionMenu($event, conversation, index, true)
        "
      >
        <aside class="left">
          <Avatar
            use-skeleton-animation
            :url="getConversationAvatar(conversation) || ''"
            size="30px"
          />
          <div
            v-if="userOnlineStatusMap && isShowUserOnlineStatus(conversation)"
            class="online-status"
            :class="[
              Object.keys(userOnlineStatusMap).length > 0
                && Object.keys(userOnlineStatusMap).includes(
                  conversation.userProfile.userID,
                )
                && userOnlineStatusMap[conversation.userProfile.userID]
                  .statusType === 1
                ? 'online-status-online'
                : 'online-status-offline',
            ]"
          />
          <span
            v-if="conversation.unreadCount > 0 && !conversation.isMuted"
            class="num"
          >
            {{
              conversation.unreadCount > 99 ? "99+" : conversation.unreadCount
            }}
          </span>
          <span
            v-if="conversation.unreadCount > 0 && conversation.isMuted"
            class="num-notify"
          />
        </aside>
        <div class="content">
          <div class="content-header">
            <label class="content-header-label">
              <p class="name">{{ getConversationName(conversation) }}</p>
            </label>
            <div class="middle-box">
              <span
                v-if="
                  conversation.draftText
                    && conversation.conversationID !== currentConversationID
                "
                class="middle-box-draft"
              >{{ TUITranslateService.t("TUIChat.[草稿]") }}</span>
              <span
                v-else-if="
                  conversation.type === 'GROUP'
                    && conversation.groupAtInfoList
                    && conversation.groupAtInfoList.length > 0
                "
                class="middle-box-at"
              >{{ conversation.getGroupAtInfo() }}</span>
              <div class="middle-box-content">
                {{ getLastMessageText(conversation) }}
              </div>
            </div>
          </div>
          <div class="content-footer">
            <span class="time">{{ getLastMessageTime(conversation) }}</span>
            <Icon v-if="conversation.isMuted" :file="muteIcon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./style/index.scss"></style>

<style lang="scss" scoped>
.disable-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
