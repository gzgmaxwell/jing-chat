<template>
  <div style="background-color: #EBF0F6;">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">隐私</span>
      </template>
    </van-nav-bar>
    <van-cell-group>
      <van-cell title="加我为好友时" is-link @click="handleClick('addMethod')" :value="agreeValue" />
      <div style="width: 100%; height:10px;background: #EBF0F6;"></div>
      <van-cell title="消息阅读状态" is-link="false" :right-icon="null" :label="readStatus">
        <template #right-icon>
          <van-switch v-model="settings.needVerifyAddFriend" @change="addChange" />
        </template>
      </van-cell>
    </van-cell-group>
    <div style="width: 100%; height:10px;background: #EBF0F6;"></div>
    <van-cell-group style="margin-bottom: 10px;">
      <van-cell title="显示在线状态" is-link="false" :right-icon="null" :label="onlineStatus">
        <template #right-icon>
          <van-switch v-model="displayOnlineStatus" @change="onlineChange" />
        </template>
      </van-cell>
    </van-cell-group>
    <!-- <van-cell title="将消息翻译成" is-link value="简体中文" /> -->

    <van-popup v-model:show="friendShow" position="bottom" :style="{ height: '310px' }">
      <div class="add-friends">
        <div class="add-content" @click="addFriendBtn('agree')">同意任何用户加好友</div>
        <van-divider />
        <div class="add-content" @click="addFriendBtn('verification')">需要验证</div>
        <van-divider />
        <div class="add-content" @click="addFriendBtn('refuse')">拒绝任何人加好友</div>
        <van-divider />
        <div class="add-content" @click="friendShow=false">取消</div>
      </div>
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { genTestUserSig } from "../../TUIKit/debug"; // 从你本地拷贝的TUIKit目录引入
import TUIChatEngine, {
  TUIUserService,
  TUIStore,
  StoreName
} from "@tencentcloud/chat-uikit-engine-lite";

import TIM from "tim-js-sdk";
const userStore = useUserStore();
const router = useRouter();
const friendShow = ref(false);
const agreeValue = ref("同意任何用户加好友");
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
if (cachedUserInfo) {
  userStore.userInfo = cachedUserInfo;
}
const userInfo = computed(() => userStore.userInfo);
interface Settings {
  needVerifyAddFriend: boolean;
  needOnline: boolean;
}

let options = {
  SDKAppID: 1600116447 // 接入时需要将0替换为您的云通信应用的 SDKAppID，类型为 Number
};
const tim = TIM.create(options);
tim.on(TIM.EVENT.SDK_READY, () => {
  console.log("SDK ready");
  // fetchConversationList();
   
});

async function login(userID: string, userSig: string) {
  try {
    await tim.login({ userID, userSig });
    console.log("登录成功");
   TUIUserService.getUserProfile({
      userIDList: [userInfo.value?.userId]
    }).then(res => {
      console.log("res11111", res);
      if (res.data[0].allowType === "AllowType_Type_AllowAny") {
        agreeValue.value = "允许任何人加好友";
      } else if (res.data[0].allowType === "AllowType_Type_NeedConfirm") {
        agreeValue.value = "需要验证";
      } else if (res.data[0].allowType === "AllowType_Type_DenyAny") {
        agreeValue.value = "拒绝任何人加好友";
      }
      // signname.value = res.data[0].selfSignature;
    });
  } catch (error) {
    console.error("登录失败", error);
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


const displayOnlineStatus = ref<boolean>(false);
const settings = ref<Settings>({
  needVerifyAddFriend: false,
  needOnline: false
});
// 根据 needVerifyAddFriend 动态计算 readStatus 的内容
const readStatus = computed(() => {
  return settings.value.needVerifyAddFriend
    ? "关闭后，您收发的消息均不带有消息阅读状态，您将无法看到对方是否已读，同时对方也无法看到您是否已读。"
    : " 开启后,您在群聊中收发的消息均带有消息的阅读状态，并且可以看到对方是否已读，与您单聊的好友若也开启了消息阅读状态，您与好友在单聊中收发的消息也将带有消息阅读状态。";
});
const onlineStatus = computed(() => {
  return displayOnlineStatus
    ? "关闭后，您将不可以在会话列表的通讯录中看到好友在线或离线的状态提示。"
    : " 开启后，您将可以在会话列表中通讯录中看到好友在线或离线的状态提示";
});
onMounted(() => {
  TUIStore.watch(StoreName.USER, {
    displayOnlineStatus: onDisplayOnlineStatusUpdated
  });
  login(userID, userSig);
});
function onDisplayOnlineStatusUpdated(status: boolean) {
  console.log("onlineStatus", status);
  displayOnlineStatus.value = status;
}

function onClickLeft() {
  router.back();
}
// 阅读状态
function addChange(newVal: boolean) {
  console.log("newVal", newVal);
  if (newVal) {
    TUIUserService.switchMessageReadStatus(true);
  } else {
    TUIUserService.switchMessageReadStatus(false);
  }
}
// 在线状态
function onlineChange(newVal: boolean) {
  console.log("newVal", newVal);
  if (newVal) {
    TUIUserService.switchUserStatus({ displayOnlineStatus: true });
  } else {
    TUIUserService.switchUserStatus({ displayOnlineStatus: false });
  }
}

function handleClick(key: string) {
  friendShow.value = true;
}
async function addFriendBtn(value) {
  if (value === "agree") {
    agreeValue.value = "同意任何用户加好友";
  } else if (value === "verification") {
    agreeValue.value = "需要验证";
  } else if (value === "refuse") {
    agreeValue.value = "拒绝任何人加好友";
  }

  let allowType;
  if (value === "agree") {
    allowType = TUIChatEngine.TYPES.ALLOW_TYPE_ALLOW_ANY;
  } else if (value === "verification") {
    allowType = TUIChatEngine.TYPES.ALLOW_TYPE_NEED_CONFIRM;
  } else if (value === "refuse") {
    allowType = TUIChatEngine.TYPES.ALLOW_TYPE_DENY_ANY;
  }

  try {
    let imResponse = await tim.updateMyProfile({allowType: allowType });
    console.log(imResponse.data,"kkkkkk"); // 更新资料成功
  } catch (imError) {
    console.warn("updateMyProfile error:", imError); // 更新资料失败
  }
 
  friendShow.value = false;
}
</script>
       <style scoped lang="scss">
.nav-bar {
  background-color: #fff;
}
.desc-text {
  padding: 8px 16px;
  color: #969799;
  font-size: 12px;
  line-height: 1.4;
  background: #ebf0f6;
}
:deep(.van-cell__title) {
  font-size: 13px !important;
}
.add-friends {
  text-align: center;
}
:deep(.van-popup) {
  opacity: 0.8;
}
.add-content {
  color: #5884fc;
  margin-top: 30px;
}
</style>