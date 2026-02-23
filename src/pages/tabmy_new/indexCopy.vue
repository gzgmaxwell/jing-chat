<script setup lang="ts">
import { getCurUserInfo, otclogout, updateUserInfo } from "@/api/user";
import { useUserStore } from "@/stores";
import router from "@/router";

import { showFailToast } from "vant";

import { useClipboard } from "@vueuse/core";
import buysellicon from "@/assets/tabbar_new/my/买卖币.png";
import shoukuan from "@/assets/tabbar_new/my/收款.png";
import zhuanzhang from "@/assets/tabbar_new/my/转账.png";
import zhangdan from "@/assets/tabbar_new/my/账单.png";

import shiming from "@/assets/tabbar_new/my/实名认证.png";
import zhifu from "@/assets/tabbar_new/my/支付密码.png";
import shoufu from "@/assets/tabbar_new/my/收付款方式.png";
import zijin from "@/assets/tabbar_new/my/资金明细.png";

import one from "@/assets/tabbar_new/my/1.png";
import two from "@/assets/tabbar_new/my/2.png";
import three from "@/assets/tabbar_new/my/3.png";
import four from "@/assets/tabbar_new/my/4.png";
import smallImg from "@/assets/tabbar_new/my/shiming.png";
import five from "@/assets/tabbar_new/my/tongyong.png";
import func from "../../../vue-temp/vue-editor-bridge";
import QrScanner from "@/components/QrScanner/index.vue";
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  nextTick,
  getCurrentInstance,
  watchEffect
} from "vue";
const userStore = useUserStore();
// 使用useClipboard
const { copy, isSupported } = useClipboard();
// 初始化store中userInfo
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
if (cachedUserInfo) {
  userStore.userInfo = cachedUserInfo;
}
// 计算属性绑定store.userInfo
const userInfo = computed(() => userStore.userInfo);
// 初始化昵称
const nickname = ref(userInfo.value?.nickName || "");
const showQrCodeReader = ref(false);

const qrcodeDetail = ref({});
onMounted(() => {
  nickname.value = userInfo.value?.nickName || "";
});

// 异步获取最新用户信息
getCurUserInfo().then(res => {
  userStore.userInfo = res.data; // 赋值给store的响应式状态
  userStore.getUserInfo();
});

// 复制钱包地址逻辑
// 复制id
async function copyAddress(param) {
  console.log("userInfo.value.userId",param,userInfo.value.userId)
  if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {

    await copy(
      param === "phone" ? userInfo.value.userId : userInfo.value.walletAddress
    );
    param === "phone" ? showToast("已复制") : showToast("钱包地址已复制");
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
}
function scanBtn() {
  showQrCodeReader.value = true;
}
function buyCoinsBtn (val){
  if(val==='买币'){
router.push({
      path: "/taborder",
      query: { data: '买币' }
    });
  }else{
router.push({
      path: "/taborder",
      query: { data: '卖币' }
    });
  }
}
const onDecodeHandler = data => {
  console.log("dayda", data);

  // paymentData.authCode = getContentFromUrl(data);
  if (data) {
    router.push({
      path: "/transferComp",
      query: { data: data }
    });
  }
  showQrCodeReader.value = false;
};
const qrReaderClose = () => {
  showQrCodeReader.value = false;
};
const getContentFromUrl = url => {
  const urlObj = new URL(url);
  const content = urlObj.searchParams.get("content");
  return content;
};
</script>

<template>
  <div class="my-container">
    <!-- 顶部蓝色渐变背景区域 -->
    <div class="bgimg text-white px-4 pb-3 pt-3 relative bg-gradient-to-b">
      <!-- 右上角的客服和邮件图标 -->
      <!-- <i class="i-carbon-headset text-16px" />
      <i class="i-carbon-email text-16px" />-->
      <div
        class="w-35px text-xl p-8px rounded-50% bg-[#0949AA] flex h-35px items-center right-16px absolute space-x-3 mt-3"
        @click="scanBtn"
      >
        <van-icon name="scan" />
      </div>
      <QrScanner v-if="showQrCodeReader" @decode="onDecodeHandler" @close="qrReaderClose"></QrScanner>
      <!-- <video ref="video" style="width: 100%; height: 300px;" autoplay muted></video> -->

      <div class="mt-2 flex items-center" @click="router.push('/myProfile')">
        <!-- <avatar-uploader @upload-success-and-refresh="refresh" /> -->
        <div class="header-img">
          <img
            :src="cachedUserInfo?.header"
            alt
            style="width: 100%; height:100%;   background-size: 100%;    border-radius: 50%;"
          />
        </div>

        <div class="ml-4">
          <div class="flex items-center">
            <span class="text-lg font-bold">{{ userInfo?.nickName || '设置昵称' }}</span>
            <i class="i-carbon-edit text-lg ml-2 cursor-pointer" />
          </div>
          <div class="text-sm mt-1 opacity-90 flex items-center">
            <span class="text-[#D8D8D8]">ID: {{ userInfo?.userId || '' }}</span>
            <i class="i-carbon-copy ml-2 cursor-pointer" @click.stop="copyAddress('phone')" />
          </div>
        </div>
      </div>
      <!-- 快捷操作：买卖币、收款、转账、账单 -->
      <div class="mt-5 px-2 flex justify-around">
        <div class="flex flex-col items-center space-y-2" @click="router.push('/tabtrade')">
          <div class="rounded-lg flex h-10 w-10 items-center justify-center">
            <van-image :src="buysellicon" width="22px" height="22px" />
          </div>
          <span class="text-[12px]">买卖币</span>
        </div>
        <div
          class="flex flex-col items-center space-y-2"
          @click="router.push('/paymentCollection')"
        >
          <div class="rounded-lg flex h-10 w-10 items-center justify-center">
            <van-image :src="shoukuan" width="22px" height="22px" />
          </div>
          <span class="text-[12px]">收款</span>
        </div>
        <div class="flex flex-col items-center space-y-2" @click="router.push('/transferComp')">
          <div class="rounded-lg flex h-10 w-10 items-center justify-center">
            <van-image :src="zhuanzhang" width="22px" height="22px" />
          </div>
          <span class="text-[12px]">转账</span>
        </div>
        <div class="flex flex-col items-center space-y-2" @click="router.push('/taborder')">
          <div class="rounded-lg flex h-10 w-10 items-center justify-center">
            <van-image :src="zhangdan" width="22px" height="22px" />
          </div>
          <span class="text-[12px]">账单</span>
        </div>
      </div>
    </div>

    <!-- 余额统计卡片 -->
    <div class="py-3 pl-12 pr-12 rounded-b-xl rounded-t-none bg-white">
      <div class="text-center flex justify-between">
        <div>
          <div class="top-font">余额</div>
          <div class="font-bold mt-1">
            {{ userInfo?.totalBalance-userInfo?.sellOrderBalance || '0' }}
            <span
              class="text-[8px] text-[#767676] font-normal"
            >GUB</span>
          </div>
        </div>
        <div @click="buyCoinsBtn('买币')">
          <div class="top-font">买币交易中</div>
          <div class="font-bold mt-1">
            {{ userInfo?.inTheProcessOfBuyingCoins || '0' }}
            <span
              class="text-[8px] text-[#767676] font-normal"
            >GUB</span>
          </div>
        </div>
        <div @click="buyCoinsBtn('卖币')">
          <div class="top-font">卖币交易中</div>
          <div class="font-bold mt-1">
            {{ userInfo?.sellingCoinsInTrading || '0' }}
            <span
              class="text-[8px] text-[#767676] font-normal"
            >GUB</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要功能网格菜单 -->
    <div class="mx-4 mt-4 p-4 rounded-xl bg-white">
      <div class="gap-2 grid grid-cols-4">
        <!-- 实名认证 -->
        <div class="flex flex-col items-center space-y-2" @click="router.push('/realnameAuth_new')">
          <div class="relative">
            <div
              class="rounded-lg bg-[#ECF1F7] img-style flex items-center justify-center"
              style="position: relative;"
            >
              <van-image :src="shiming" width="28px" height="28px" />
              <div class="samll-img">
                <van-image :src="smallImg" width="16px" height="16px" />
              </div>
            </div>
          </div>
          <span class="text-xs mt-7px">实名认证</span>
        </div>

        <!-- 支付密码 -->
        <div
          class="flex flex-col items-center space-y-2"
          @click="router.push('/payPwd_new/editPayPwd')"
        >
          <div class="relative">
            <div
              class="rounded-lg bg-[#ECF1F7] img-style flex items-center justify-center"
              style="position: relative;"
            >
              <van-image :src="zhifu" width="28px" height="28px" />
              <div class="samll-img">
                <van-image :src="smallImg" width="16px" height="16px" />
              </div>
            </div>
            <!-- <div class="p-0.5 rounded-full bg-white absolute -bottom-1 -right-1">
              <van-icon name="checked" color="#07c160" size="12" />
            </div>-->
          </div>
          <span class="text-xs mt-7px">支付密码</span>
        </div>

        <!-- 收付款方式 -->
        <div
          class="flex flex-col items-center space-y-2"
          @click="router.push('/reciptpaymethod_new')"
        >
          <div class="rounded-lg bg-[#ECF1F7] img-style flex items-center justify-center">
            <van-image :src="shoufu" width="28px" height="28px" />
          </div>
          <span class="text-xs mt-7px">收付款方式</span>
        </div>

        <!-- 资金明细 -->
        <div class="flex flex-col items-center space-y-2" @click="router.push('/fundDetails')">
          <div class="rounded-lg bg-[#ECF1F7] img-style flex items-center justify-center">
            <van-image :src="zijin" width="28px" height="28px" />
          </div>
          <span class="text-xs mt-7px">资金明细</span>
        </div>
      </div>
    </div>

    <!-- 设置列表 -->
    <div class="mx-4 mt-4 space-y-4">
      <!-- 通知/聊天设置 -->
      <div class="rounded-xl bg-white overflow-hidden">
        <!-- <van-cell is-link center @click="router.push('/notificationSettings')">
          <template #title>
            <span class="text-sm ml-2">通知设置</span>
          </template>
          <template #icon>
            <van-image :src="one" width="18px" height="18px" />
          </template>
        </van-cell> -->
        <van-cell is-link center @click="router.push('/chatSettings')">
          <template #title>
            <span class="text-sm ml-2">聊天设置</span>
          </template>
          <template #icon>
            <van-image :src="two" width="18px" height="18px" />
          </template>
        </van-cell>
      </div>

      <!-- 隐私/安全设置 -->
      <div class="rounded-xl bg-white overflow-hidden mt-4">
        <van-cell is-link center @click="router.push('/privacySettings')">
          <template #title>
            <span class="text-sm ml-2">隐私</span>
          </template>
          <template #icon>
            <van-image :src="three" width="18px" height="18px" />
          </template>
        </van-cell>
        <van-cell is-link center @click="router.push('/securitySettings')">
          <template #title>
            <span class="text-sm ml-2">安全</span>
          </template>
          <template #icon>
            <van-image :src="four" width="18px" height="18px" />
          </template>
        </van-cell>
      </div>

      <!-- Logout Button -->
      <!-- <div class="mt-4">
        <van-button type="default" block class="!border-none" @click="isLogoutShow = true">退出登录</van-button>
      </div>-->

      <!-- 通用设置 -->
      <div class="rounded-xl bg-white overflow-hidden mt-4">
        <van-cell is-link center @click="router.push('/generalSettings')">
          <template #title>
            <span class="text-sm text-gray-700 font-medium ml-2">通用</span>
          </template>
          <template #icon>
            <van-image :src="five" width="18px" height="18px" />
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bgimg {
  background-image: url("@/assets/tabbar_new/bgimg.png");
  background-size: cover;
}
.my-container {
  height: 100vh;
  background: #ecf1f7;
  overflow-y: auto;
  padding-bottom: 40px;
}
.top-font {
  font-size: 12px;
  color: #000000;
}
.img-style {
  width: 44px;
  height: 44px;
}
.samll-img {
  position: absolute;
  right: -5px;
  bottom: -10px;
}
.header-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>

<route lang="json5">
{
  name: 'My_new'
}
</route>
