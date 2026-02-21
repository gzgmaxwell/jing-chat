<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import tranform from "@/assets/tabbar_new/my/tranform.png";
import scan from "@/assets/tabbar_new/my/scan.png";
import iconpro from "@/assets/tabbar_new/my/iconpro.png";
import { ref, computed, watch } from "vue";
import { useClipboard } from "@vueuse/core";
import { showNotify } from "vant";
import { ResCode } from "@/utils/const";
import { transferMethod } from "@/api/transfer";
import { rsaEncrypt } from "@/utils/jsencryptUtil";
import QrScanner from "@/components/QrScanner/index.vue";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const route = useRoute();
// 模拟数据
const balance = ref(0);
const dailyUsed = ref(0);
const dailyLimit = ref(1000000);
const feeRate = 0.001; // 手续费费率0.1%

const address =  ref(route.query.data ? route.query.data : "");
const amountInput = ref("");
const amountInputTip = "到账数量(GUB)";
const payPassword = ref(false);
const zfmm = ref("");
const showQrCodeReader = ref(false);
const onDecodeHandler = data => {
  console.log("dayda", data);

  // paymentData.authCode = getContentFromUrl(data);
  if (data) {
    address.value = data;
  }
  showQrCodeReader.value = false;
};
const qrReaderClose = () => {
  showQrCodeReader.value = false;
};
const receivedAmount = computed(() => {
  const num = parseFloat(amountInput.value) || 0;
  const fee = num * feeRate;
  return Math.max(0, num - fee);
});
const fee = computed(() => {
  const num = parseFloat(amountInput.value) || 0;
  return num * feeRate;
});

// 初始化余额，这里示意写死，你实际用接口获取
balance.value = 10000;

const goBack = () => {
  window.history.back();
};

const showHistory = () => {
  alert("展示转账记录或其他操作");
};

// 粘贴功能
const { copy, copied } = useClipboard();

async function pasteAddress() {
  // 从剪贴板读取
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      address.value = text;
    }
  } catch (e) {
    alert("无法访问剪贴板");
  }
}

// 全部按钮
function fillMax() {
  amountInput.value = balance.value.toFixed(2);
}

function onAmountChange(val: string) {
  let num = parseFloat(val);
  if (isNaN(num)) {
    amountInput.value = "";
    return;
  }

  // 限额限制 1~500000
  if (num < 1) num = 1;
  if (num > 500000) num = 500000;
  amountInput.value = num.toString();
}

function onSubmit() {
  console.log("address.value11111",address.value);
  // if (!address.value) {
  //   showNotify({ type: "warning", message: "请输入接收地址" });
  //   return;
  // }
  // const num = parseFloat(amountInput.value);
  // if (isNaN(num) || num < 1 || num > 500000) {
  //   showNotify({ type: "warning", message: "数量不在有效范围" });

  //   return;
  // }
  payPassword.value = true;
}
function onSubmitBtn() {
  if (!zfmm.value) {
    showNotify({ type: "warning", message: "请输入支付密码" });
    return;
  }
  const sellData = {
    money: amountInput.value.trim(), // 金额
    zfmm: rsaEncrypt(zfmm.value.trim()) as string, // 支付密码
    address: address.value
  };
  transferMethod(sellData).then(res => {
    if (res.code === ResCode.SUCCESS) showToast("转账成功");
  });
}
</script>



<template>
  <div class="flex flex-col bg-white min-h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">转账</span>
      </template>
      <template #right>
        <div @click="router.push('/transferComp/transferRecord')">
          <img :src="tranform" class="w-24px h-24px" />
        </div>
      </template>
    </van-nav-bar>
    <div class="p-17px">
      <van-cell-group>
        <div class="text-14px mb-2">地址</div>
        <van-field v-model="address" placeholder="输入接收者地址" class="mb-6 rounded-lg bg-[#F7F8FA]">
          <template #button>
            <div class="flex">
              <div>粘贴</div>
              <div class="mt-4px ml-5px" @click="showQrCodeReader=true">
                <img :src="scan" alt class="w-14px h-14px" />
              </div>
            </div>
          </template>
        </van-field>
        <div class="flex justify-between text-14px">
          <div class="mb-2">数量</div>
          <div style="color: #8A8A8D;">
            可用余额
            <span style="color: #0256FF;">0.00</span> GUB
          </div>
        </div>
        <van-field
          v-model="amountInput"
          placeholder="限额1~500,000 GUB"
          class="mb-10px rounded-lg bg-[#F7F8FA]"
          type="number"
        >
          <template #button>
            <span style="color: #0256FF;">全部</span>
          </template>
        </van-field>
        <van-field
          v-model="amountInputTip"
          placeholder="到账数量(GUB)"
          class="mb-10px rounded-lg bg-[#F7F8FA]"
          readonly
        >
          <template #left-icon>
            <img :src="iconpro" alt class="w-18px h-18px" />
            <!-- 或者自定义svg -->
          </template>
          <template #button>
            <span style="color: #0256FF;font-size: 10px;">
              {{amountInput}}
              <span style="color: #8A8A8D;">(手续费 0.00)</span>
            </span>
          </template>
        </van-field>
      </van-cell-group>

      <div class="tip">
        <p>24h转账额度: {{ dailyUsed.toFixed(2) }}/{{ dailyLimit.toFixed(2) }} GUB</p>
        <p>到账数量 = 提款数量 - 手续费。</p>
        <p>请勿用于其他币种，否则资产将不可找回，</p>
      </div>

      <div class="button-style" @click="onSubmit">
        <van-button block color="#0256FF" class="rounded-lg">确认转账</van-button>
      </div>
    </div>
    <QrScanner v-if="showQrCodeReader" @decode="onDecodeHandler" @close="qrReaderClose"></QrScanner>
    <van-popup
      v-model:show="payPassword"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
    >
      <div class="text-center">
        <h1 class="font-bold mb-4">请输入支付密码</h1>
        <div>{{ amountInput }} GUB</div>
      </div>
      <van-divider :style="{padding:'0',borderColor: '#E5E5E5',height:'4px', margin:'8px 0'}" />
      <van-cell-group>
        <div class="text-14px mb-2">支付密码</div>
        <van-field v-model="zfmm" placeholder="输入支付密码" class="mb-6 rounded-lg bg-[#F7F8FA]"></van-field>
      </van-cell-group>

      <div @click="onSubmitBtn">
        <van-button block color="#0256FF" class="rounded-lg">确认转账</van-button>
      </div>
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
:deep(.van-cell) {
  background: #ecf1f7;
}
.button-style {
  position: absolute;
  bottom: 88px;
  width: 343px;
}
.paste-text {
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
}

.amount-label {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.balance {
  font-size: 12px;
  color: #999;
}

.blue-text {
  color: #1677ff;
}

.tip {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
}

.submit-btn {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  height: 44px;
}
</style>