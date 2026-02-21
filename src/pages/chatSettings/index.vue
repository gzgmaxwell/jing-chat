<template>
  <div>
    <van-nav-bar title="聊天设置" left-arrow @click-left="onBack" />

    <!-- <van-cell-group>
      <van-cell title="使用听筒播放语音消息" is-link="false" :right-icon="null" :value="useReceiver">
        <template #right-icon>
          <van-switch v-model="suseReceiver" />
        </template>
      </van-cell>

      <van-cell title="回车键发送消息" is-link="false" :right-icon="null" :value="enterSend">
        <template #right-icon>
          <van-switch v-model="enterSend" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group style="margin-top: 10px;">
      <van-cell title="表情包管理" is-link clickable @click="onManageEmojis" />
      <van-cell title="群发助手" is-link clickable @click="onGroupAssistant" />
    </van-cell-group>-->

    <van-cell-group style="margin-top: 10px;">
      <!-- <van-cell title="清除本地缓存" clickable @click="onClearHistory" /> -->
      <van-cell title="清除聊天记录" clickable @click="onClearChatHistory" />
    </van-cell-group>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";
import { TUIChatService } from "@tencentcloud/chat-uikit-engine-lite";
import { TUILogin } from "@tencentcloud/tui-core-lite";
import { genTestUserSig } from "../../TUIKit/debug"; // 从你本地拷贝的TUIKit目录引入
import { framework } from "../../TUIKit/adapter-vue";
import TIM from "tim-js-sdk";
import { useUserStore } from "@/stores";
import { TUIStore } from "@tencentcloud/chat-uikit-engine-lite";
import {
  StoreName,
  IConversationModel
} from "@tencentcloud/chat-uikit-engine-lite";
const router = useRouter();
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
const userStore = useUserStore();
const nextReqMessageID = ref("");
const conversationList = ref<IConversationModel[]>([]);
const currentConversation = ref<IConversationModel>();
const currentConversationID = ref<string>();
if (cachedUserInfo) {
  userStore.userInfo = cachedUserInfo;
}

const userInfo = computed(() => userStore.userInfo);

let options = {
  SDKAppID: 1600116447 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
};
const tim = TIM.create(options);
tim.on(TIM.EVENT.SDK_READY, () => {
  console.log("SDK ready");
  fetchConversationList();
});

async function login(userID: string, userSig: string) {
  try {
    await tim.login({ userID, userSig });
    console.log("登录成功");
  } catch (error) {
    console.error("登录失败", error);
  }
}

async function fetchConversationList() {
  try {
    const res = await tim.getConversationList();
    console.log("会话列表:", res.data);
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, event => {
      console.log("会话列表更新事件", event.data);
    });
    let promise = TUIChatService.getMessageList();
    console.log(promise, "nnnnnn");
    promise.catch(error => {
      // 调用异常时业务侧可以通过 promise.catch 捕获异常进行错误处理
    });
  } catch (error) {
    console.error("获取会话列表失败", error);
  }
}
const SDKAppID = 1600116447; // 替换成你的 SDKAppID
const secretKey =
  "0b46a8213d81da2e212f683bf101f9633c9a636c18eccec09f92c41245b54647"; //
// 页面初始化或按钮事件中调用
const userID = userInfo.value?.userId;
const userSig = genTestUserSig({
  SDKAppID,
  secretKey,
  userID: userInfo.value?.userId
}).userSig;
login(userID, userSig);

// 返回事件
function onBack() {
  router.back();
}

onMounted(() => {
  TUIStore.watch(StoreName.CONV, {
    currentConversationID: onCurrentConversationIDUpdated,
    conversationList: onConversationListUpdated,
    currentConversation: onCurrentConversationUpdated
  });
  console.log("conversationList", conversationList);
  // fetchConversationList()
});

function onClearHistory() {
  showConfirmDialog({
    title: "提示",
    message: "确定要清除本地缓存吗？"
  })
    .then(async () => {
      // 清除聊天记录的逻辑
      // await tim.clearCache();
      // const tim = TUIKitInstance;
      // await tim.logout();
      // showToast("本地缓存已清除");
    })
    .catch(() => {
      // 取消
    });
}

// 删除某个会话的本地消息
function onCurrentConversationIDUpdated(id: string) {
  currentConversationID.value = id;
}
function onCurrentConversationUpdated(conversation: IConversationModel) {
  currentConversation.value = conversation;
}
function onConversationListUpdated(list: IConversationModel[]) {
  conversationList.value = list;
  console.log("object111111111", list);
}
function onClearChatHistory() {
  showConfirmDialog({
    title: "提示",
    message: "确定要清除聊天记录吗？"
  })
    .then(async () => {
      for (const conv of conversationList.value) {
        try {
          const promise = TUIChatService.clearHistoryMessage(
            conv.conversationID
          );
          const chatResponse = await promise;
          const { result } = chatResponse.data;
          console.log(`删除会话 ${conv.conversationID} 结果:`, result);
        } catch (error) {
          console.error(`删除会话 ${conv.conversationID} 失败:`, error);
        }
      }
    })
    .catch(() => {
      // 取消
    });
}
</script>
  
  <style scoped>
/* Vant 内置样式基本够用，这里无需额外写样式 */
</style>
  