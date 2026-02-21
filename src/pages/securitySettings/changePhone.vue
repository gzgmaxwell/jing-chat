<script setup lang="ts">
import router from "@/router";
import { computed, ref } from "vue";
import captchaIcon from "@/assets/tabbar_new/login/captcha.png";
import phonecodeIcon from "@/assets/tabbar_new/login/phonecode.png";
import { changeZfPwd, getCaptcha, getPhoneCode } from "@/api/user";
import { showToast } from "vant";
import { ResCode } from "@/utils/const";
import { useUserStore } from "@/stores";

const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
const isLogoutShow = ref(false);
const captcha = ref(""); // 图形码
const isCounting = ref(false); // 是否倒计时
const countdown = ref(0);
const code = ref("");
const userStore = useUserStore();
let timer = null;
const captchaImg = ref(""); // 图形
const onClickLeft = () => router.back();
// 开始倒计时
async function startCountdown() {
  console.log("cachedUserInfo.phoneNum.value", cachedUserInfo.phoneNum);
  if (!!cachedUserInfo.phoneNum === false) {
    showToast("请输入手机号");
    return;
  }
  if (captcha.value === "") queryCaptcha();
  if (captcha.value.trim() === "") {
    showToast("请输入图形验证码");
    return;
  }
  const data = await getPhoneCode({
    vsCode: captcha.value,
    phoneNum: cachedUserInfo.phoneNum
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
// 进页面就获取captcha
queryCaptcha();
function queryCaptcha() {
  getCaptcha().then(res => {
    captchaImg.value = URL.createObjectURL(res);
  });
}
// 计算按钮文本
function buttonText() {
  if (isCounting.value) {
    return `${countdown.value}s`;
  }
  return "获取验证码";
}
 function confirmNext() {
  if (code.value.trim() === "") {
    showToast("请输入验证码");
    return;
  }
  try {
    const data =  userStore.login({
      phoneNum: cachedUserInfo.phoneNum,
      code: code.value.trim()
    });

    console.log(data, "kkkii");
    if (data?.code == ResCode.SUCCESS) {
      showToast(data?.msg);
    } else {
      router.push({
        path: "/securitySettings/changePhoneConfirm"
      });
    }
  } catch (e) {
    showToast(e.message);
  }
}
</script>

<template>
  <div class="font-sans flex flex-col h-screen bg-white">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">更换手机号</span>
      </template>
    </van-nav-bar>
    <div class="p-12px">
      <div class="text-12px" style="color: #909090;">为保证您的账号安全，我们需要验证身份，输入旧号码验证码进行验证</div>
      <div class="mt-10px">{{ cachedUserInfo.phoneNum }}</div>
      <!-- 输入图形验证码 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field v-model="captcha" label-width="10" placeholder="输入图形验证码" left-icon="lock">
          <template #left-icon>
            <img :src="captchaIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
          </template>
          <template #button>
            <van-image :src="captchaImg" class="h-8 w-25" @click="queryCaptcha" />
          </template>
        </van-field>
      </van-cell-group>
      <!-- 输入验证码 -->
      <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
        <van-field v-model="code" label-width="10" placeholder="输入验证码" left-icon="lock">
          <template #left-icon>
            <img :src="phonecodeIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
          </template>
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
        <van-button color="#0256FF" class="w-full" type="primary" @click="confirmNext">下一步</van-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.van-field__left-icon) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>