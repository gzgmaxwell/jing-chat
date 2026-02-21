<script setup lang="ts">
import router from "@/router";
import { computed, ref } from "vue";
import { showToast } from "vant";
import { ResCode } from "@/utils/const";
import { getCurUserInfo, getEmailCodeReq,getEmailBind } from "@/api/user";
import { useUserStore } from "@/stores";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const emailAdress = ref("");
const isCounting = ref(false); // 是否倒计时
const countdown = ref(0);
const code = ref("");
const userStore = useUserStore();
let timer  : ReturnType<typeof setTimeout> | null = null;;
// 计算按钮文本
function buttonText() {
  if (isCounting.value) {
    return `${countdown.value}s`;
  }
  return "获取验证码";
}
// 开始倒计时
async function startCountdown() {

  if (emailAdress.value.trim() === "") {
    showToast("请输入邮箱地址");
    return;
  }
  const data = await getEmailCodeReq({
    emailAddress: emailAdress.value
  });

  if (data?.code !== ResCode.SUCCESS) showToast(data?.msg);

  if (isCounting.value) return;

  // 设置倒计时时间
  countdown.value = 5;
  isCounting.value = true;

  // 设置定时器
  timer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(timer);
      isCounting.value = false;
    }
  }, 1000);
}
async function confirmNext() {
  if (code.value.trim() === "") {
    showToast("请输入验证码");
    return;
  }
  try {
// 发请求
const data = await getEmailBind({
    emailAddress: emailAdress.value.trim(),
    emailCode: code.value.trim(),
   
  });
  if (data?.code === ResCode.SUCCESS) {
    showToast("绑定成功");
    await userStore.getUserInfo()
  }
  } catch (e) {
    showToast(e.message);
  }
}
</script>

<template>
  <div class="font-sans flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">邮箱绑定</span>
      </template>
    </van-nav-bar>
    <!-- 输入图形验证码 -->
    <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
      <van-field v-model="emailAdress" label-width="10" placeholder="请输入邮箱地址"></van-field>
    </van-cell-group>
    <!-- 输入验证码 -->
    <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
      <van-field v-model="code" label-width="10" placeholder="请输入邮箱地验证码">
        <template #button>
          <van-button
            color="#0256FF"
            plain
            type="primary"
            size="small"
            :disabled="isCounting"
            class="pl-5 pr-5 rounded-lg h-10"
            @click="startCountdown"
          >{{ buttonText() }}</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="mt-10">
      <van-button color="#0256FF" class="w-full" type="primary" @click="confirmNext">确定</van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.about-content {
  padding: 12px 26px;
  font-size: 12px;
  color: #000000;
  line-height: 17px;
}
</style>