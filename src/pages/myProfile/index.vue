<template>
  <div>
    <van-nav-bar title="我的资料" left-text left-arrow @click-left="onBack" />
    <van-cell-group>
      <van-cell title="更换头像" is-link>
        <template #right-icon>
          <div class="password-style">
            <div class="ps-img">
              <avatar-uploader @upload-success-and-refresh="refresh" />
            </div>

            <div class="ps-left">
              <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell
        title="昵称"
        is-link
        :value="userInfo?.nickName || '设置昵称' "
        @click="nicknameShow = true"
      />
      <van-cell title="个性签名" is-link :value="signname|| '设置昵称' " @click="signnameShow = true" />
      <van-cell title="我的二维码" is-link @click="codeShow = true">
        <template #right-icon>
          <div class="password-style">
            <div class="ps-img" style="width: 20px; height:20px">
              <img :src="mycode" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>

            <div class="ps-left">
              <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-popup
      v-model:show="nicknameShow"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
    >
      <div class="text-center">
        <h3 class="font-bold mb-4">昵称修改</h3>
        <van-field v-model="nickname" placeholder="昵称限制2-8位长度" style="margin-bottom: 33px;" />
        <van-button
          type="primary"
          color="#0256FF"
          block
          class="mt-4"
          @click="updateNickName(); nicknameShow = false"
        >提交</van-button>
      </div>
    </van-popup>
    <van-popup
      v-model:show="signnameShow"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
    >
      <div class="text-center">
        <h3 class="font-bold mb-4">个性签名修改</h3>
        <van-field v-model="signname" placeholder="昵称限制2-8位长度" style="margin-bottom: 33px;" />
        <van-button
          type="primary"
          color="#0256FF"
          block
          class="mt-4"
          @click="updateSignName(); signnameShow = false"
        >提交</van-button>
      </div>
    </van-popup>
    <van-popup v-model:show="codeShow" closeable round :style="{ padding: '20px', width: '90%' }">
      <div class="text-center">
        <h3 class="font-bold mb-4">我的二维码</h3>
        <div class="code-style">
          <img :src="mycodeImg" alt style="width: 100%; height:100%" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
    
    <script lang="ts" setup>
import { getCurUserInfo, updateUserInfo } from "@/api/user";
import { ref } from "vue";
import { useRouter } from "vue-router";
import mycode from "@/assets/tabbar_new/my/mycode.png";
import lefticon from "@/assets/tabbar_new/my/lefticon.png";
import { useUserStore } from "@/stores";
import { ResCode } from "@/utils/const";
import  {
  TUIChatService,
  IMessageModel,
  TUIUserService
} from "@tencentcloud/chat-uikit-engine-lite";
import  { TUILogin } from "@tencentcloud/tui-core-lite";
// import { TUIChatEngine } from '@tencentcloud/tui-chat-engine'; 
import { genTestUserSig } from "../../TUIKit/debug"; // 从你本地拷贝的TUIKit目录引入
import { framework } from "../../TUIKit/adapter-vue";
import QRCode from 'qrcode';
const router = useRouter();
const userStore = useUserStore();
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
const nicknameShow = ref(false);
const signnameShow = ref(false);
const codeShow = ref(false);
const signname = ref("");
const mycodeImg = ref("")
if (cachedUserInfo) {
  userStore.userInfo = cachedUserInfo;
}
const userInfo = computed(() => userStore.userInfo);
const nickname = ref(userInfo.value?.nickName || "");
function tuikitLogin (){
  // const chatEngine = new TUIChatEngine();
  const SDKAppID = 1600116447; // 替换成你的 SDKAppID
  const secretKey =
    "0b46a8213d81da2e212f683bf101f9633c9a636c18eccec09f92c41245b54647";
  TUILogin.login({
    SDKAppID,
    userID: userInfo.value?.userId,
    userSig: genTestUserSig({
      SDKAppID,
      secretKey,
      userID: userInfo.value?.userId
    }).userSig,
    // useUploadPlugin: true, // 如果需要发送图片、文件等富媒体消息，请设置为true
    framework // 传入Vue框架适配器
  }) .then(() => {
    // 等待 TUIChatEngine 的初始化完成
    // chatEngine.once('ready', () => {
      // TUIChatEngine初始化完成，调用用户资料接口
      TUIUserService.getUserProfile({
        userIDList: [userInfo.value?.userId],
      }).then(res => {
        console.log("res", res);
        signname.value = res.data[0].selfSignature;
      });
    // });
  })
  .catch(error => {
    console.error("腾讯IM登录失败:", error);
  });

    
}
onMounted(() => {
  nickname.value = userInfo.value?.nickName || "";
  tuikitLogin()
  codeGenerate()
});
 function codeGenerate (){
  QRCode.toDataURL(userInfo.value?.userId)
  .then(url => {
    console.log(url);
    mycodeImg.value = url
    // 你可以将url赋值给<img src="url" />的src属性展示二维码
  })
  .catch(err => {
    console.error(err);
  });
 }
// 异步获取最新用户信息
getCurUserInfo().then(res => {
  userStore.userInfo = res.data; // 赋值给store的响应式状态
});

// 刷新用户信息
function refresh() {
  userStore.getUserInfo();
  userStore.userInfo = JSON.parse(localStorage.getItem("userInfo"));
}
function updateSignName() {
  updateSignature(signname.value);
}
async function updateSignature(newSignature) {
  try {
    // 更新个性签名
    const updateRes = await TUIUserService.updateMyProfile({
      selfSignature: newSignature
    });
    console.log("更新接口返回:", updateRes);

    // 等待一小段时间，确保数据同步
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒延迟

    // 直接调用获取接口，无需重新登录
    const res = await TUIUserService.getUserProfile({
      userIDList: [userInfo.value?.userId],
    });

    if (res.data.length > 0) {
      signname.value = res.data[0].selfSignature || '未设置个性签名';
      console.log('最新个性签名:', signname.value);
    } else {
      console.warn('未获取到用户资料');
    }

    console.log("个性签名更新并刷新成功");
  } catch (error) {
    console.error("个性签名更新失败", error);
  }
}


// 改昵称
function updateNickName() {
  updateUserInfo({ nickName: nickname.value })
    .then(async res => {
      if (res.code === ResCode.SUCCESS) {
        // 上传成功后重新获取个人信息
        await userStore.getUserInfo();
        showToast("昵称修改成功");
      }
      refresh();
    })
    .catch(() => {
      showFailToast("昵称修改失败");
    });
}
function onBack() {
  router.back();
}
</script>
    
    <style scoped lang="scss">
.password-style {
  display: flex;
  align-items: center;
}
.ps-img {
  width: 30px;
  height: 30px;
  margin-right: 12px;
}
.ps-content {
  font-size: 12px;
  color: #8a8a8d;
  margin-right: 6px;
}
.ps-left {
  width: 12px;
  height: 12px;
}
:deep(.van-field) {
  height: 40px;
  background: #eaeff5;
  border-radius: 4px;
}
.code-style {
  width: 284px;
  height: 284px;
  background: #ffffff;
}
</style>
    