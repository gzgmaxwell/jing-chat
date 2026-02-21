<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { validPhone } from "@/utils/regexUtils";
import { changeZfPwd, getCaptcha, getPhoneCode } from "@/api/user";
import { ResCode } from "@/utils/const";
import { throttle } from "lodash-es";
import { rsaEncrypt } from "@/utils/jsencryptUtil";

import phoneIcon from "@/assets/tabbar_new/login/phone.png";
import pwdIcon from "@/assets/tabbar_new/login/pwd.png";
import captchaIcon from "@/assets/tabbar_new/login/captcha.png";
import phonecodeIcon from "@/assets/tabbar_new/login/phonecode.png";

const router = useRouter();
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
const phoneAreaPrefix = ref("86");
const phoneNumber = ref("");
const oldPassword = ref("");
const newPassword = ref("")
const passwordAgain = ref("");
const code = ref("");
const showPassword = ref(false)
const showNewPassword = ref(false);
const showPasswordAgain = ref(false);
const showAreaSelect = ref(false);
const isCounting = ref(false); // 是否倒计时

let timer = null;
const countdown = ref(0);
const captcha = ref('') // 图形码
const captchaImg = ref(""); // 图形

// 区号列表
const areaList = ref([
  { text: "中国 +86", value: "86" },
  { text: "中国香港 +852", value: "852" },
  { text: "中国澳门 +853", value: "853" },
  { text: "中国台湾 +886", value: "886" },
  { text: "日本 +81", value: "81" },
  { text: "韩国 +82", value: "82" },
  { text: "美国 +1", value: "1" }
]);
const selectedArea = ref(areaList.value[0]);
onMounted(() => {
  console.log("object", JSON.parse(localStorage.getItem("userInfo")).phoneNum);
  phoneNumber.value = JSON.parse(localStorage.getItem("userInfo")).phoneNum;
});
// 处理区号变更
function handleAreaChange(value: { text: string; value: string }) {
  selectedArea.value = value;
}

// 确认选择区号
function confirmAreaSelect({ selectedValues }) {
  phoneAreaPrefix.value = selectedValues[0];
  showAreaSelect.value = false;
}

// 开始倒计时
async function startCountdown() {
  if (!!phoneNumber.value === false) {
    showToast("请输入手机号");
    return;
  }
  if (captcha.value === '')
    queryCaptcha()
  if (captcha.value.trim() === '') {
    showToast('请输入图形验证码')
    return
  }
  const data = await getPhoneCode({
    vsCode: captcha.value,
    phoneNum: phoneNumber.value
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

// 计算按钮文本
function buttonText() {
  if (isCounting.value) {
    return `${countdown.value}s`;
  }
  return "获取验证码";
}

// 确认修改
const confirmUpdateTh = throttle(confirmUpdate, 800);
async function confirmUpdate() {
  if (phoneNumber.value.trim() === "") {
    showToast("请输入手机号");
    return;
  }
  if (!validPhone(phoneNumber.value.trim())) {
    showToast("请输入正确的手机号");
    return;
  }
  if (oldPassword.value.trim() === "") {
    showToast("请输入原支付密码");
    return;
  }
  if (oldPassword.value.trim().length < 6) {
    showToast("原密码不能少于6位");
    return;
  }
  if (newPassword.value.trim() === "") {
    showToast("请输入新支付密码");
    return;
  }
  if (newPassword.value.trim().length < 6) {
    showToast("新密码不能少于6位");
    return;
  }
  if (passwordAgain.value.trim() === "") {
    showToast("请输入新支付密码");
    return;
  }
  if (passwordAgain.value.trim().length < 6) {
    showToast("新密码不能少于6位");
    return;
  }
  if (passwordAgain.value.trim() !== newPassword.value.trim()) {
    showToast("两次输入的密码不一致");
    return;
  }
  if (code.value.trim() === "") {
    showToast("请输入验证码");
    return;
  }

  // 发请求
  const data = await changeZfPwd({
    phone: phoneNumber.value.trim(),
    code: code.value.trim(),
    oldPayPassword:rsaEncrypt(oldPassword.value.trim()) as string,
    payPassword: rsaEncrypt(newPassword.value.trim()) as string
  });
  if (data?.code === ResCode.SUCCESS) {
    showToast("密码修改成功，请重新登录");
   
  }
}

// 进页面就获取captcha
queryCaptcha();
function queryCaptcha() {
  getCaptcha().then(res => {
    captchaImg.value = URL.createObjectURL(res);
  });
}
// 选手机区号
</script>

<template>
  <div>
    <van-nav-bar left-arrow @click-left="router.back()">
      <template #title>
        <span class="text-lg text-black font-bold">修改支付密码</span>
      </template>
    </van-nav-bar>
    <div class="p-4 pt-5 bg-white flex min-h-screen justify-center">
      <div class="max-w-xs w-full">
        <!-- 手机号输入 + 区号选择 -->
        <van-cell-group :border="false" class="border-b-1 border-b-[#E5E5E5]">
          <van-field v-model="phoneNumber" type="tel" label-width="35" placeholder="输入手机号">
            <template #left-icon>
              <img :src="phoneIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
            </template>
            <template #label>
              <div class="border-r-[#E5E5E5] flex items-center" @click="showAreaSelect = true">
                <span>+{{ phoneAreaPrefix }}</span>
                <!-- 使用 Vant 的向下箭头图标 -->
                <van-icon name="arrow-down" style="margin-left: 4px;" />
              </div>
            </template>
          </van-field>
        </van-cell-group>
        <!-- 原密码输入 -->
        <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
          <van-field
            v-model="oldPassword"
            :type="showPassword ? 'text' : 'password'"
            label-width="10"
            placeholder="原6位支付密码"
            :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPassword = !showPassword"
          >
            <template #left-icon>
              <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
            </template>
          </van-field>
        </van-cell-group>
        <!-- 新密码 -->
        <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
          <van-field
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            label-width="10"
            placeholder="新6位支付密码"
            :right-icon="showNewPassword ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showNewPassword = !showNewPassword"
          >
            <template #left-icon>
              <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 确认新密码 -->
        <van-cell-group class="mt-4 border-b-1 border-b-[#E5E5E5]" :border="false">
          <van-field
            v-model="passwordAgain"
            :type="showPasswordAgain ? 'text' : 'password'"
            label-width="10"
            placeholder="确认6位支付密码"
            :right-icon="showPasswordAgain ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPasswordAgain = !showPasswordAgain"
          >
            <template #left-icon>
              <img :src="pwdIcon" class="h-[20px] w-[20px] object-contain" alt="icon" />
            </template>
          </van-field>
        </van-cell-group>

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
        <!-- 忘记密码链接 -->
        <div class="mt-8 text-center">
          <span
            class="text-sm text-[#0256FF] cursor-pointer"
            @click="router.push('/payPwd_new/forgetPayPwd')"
          >忘记支付密码?</span>
        </div>

        <!-- 登录按钮 -->
        <div class="mt-10">
          <van-button color="#0256FF" class="w-full" type="primary" @click="confirmUpdateTh">确认</van-button>
        </div>

        <!-- 区号选择弹窗 -->
        <van-popup v-model:show="showAreaSelect" position="bottom" :style="{ height: '310px' }">
          <van-picker
            show-toolbar
            title="选择区号"
            :columns="areaList"
            @confirm="confirmAreaSelect"
            @cancel="showAreaSelect = false"
            @change="handleAreaChange"
          />
        </van-popup>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.van-field__left-icon) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
