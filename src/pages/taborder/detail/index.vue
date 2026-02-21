<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import yinhangka from "../../../assets/trade/yinhangka.png";
import weixin from "../../../assets/trade/weixin.png";
import zhifubao from "../../../assets/trade/zhifubao.png";
import { ResCode } from "@/utils/const";
import { useClipboard } from "@vueuse/core";
import {
  getBuyCoinsDetail,
  sellCoinsReminder,
  transactionReminder,
  cancelOrder,
  commitSeller
} from "@/api/sellbuycoin";
const route = useRoute();
const { copy, isSupported } = useClipboard();
const active = ref(1);
const {
  id,
  sellerHeader,
  orderStatusName,
  money,
  orderNumber,
  buyerId,
  createTime,
  sellerNickName,
  buyerNickName
} = route.query;
const orderDetail = ref({});
onMounted(() => {
  queryBuyCoinsList();
});
function onClickLeft() {
  router.back();
}
// 计算倒计时时间，单位毫秒
function getCountDownTime(createTimeStr: string): number {
  const createTimestamp = new Date(createTimeStr.replace(/-/g, "/")).getTime();
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;
  const endTime = createTimestamp + fifteenMinutes;
  const remainTime = endTime - now;
  return remainTime > 0 ? remainTime : 0;
}
async function copyNum(val: any) {
  if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {
    await copy(val);
    showToast("已复制");
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
}
function queryBuyCoinsList() {
  getBuyCoinsDetail(id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      orderDetail.value = res.data;
      if (res.data.orderStatus === "1") {
        active.value = 1;
      } else if (res.data.orderStatus === "2") {
        active.value = 2;
      }
    }
  });
}
function transactionReminderBtn() {
  sellCoinsReminder(orderDetail.value.orgOrderId).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
    }
  });
}
function cancelOrderBtn() {
  cancelOrder(id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
      router.back();
    }
  });
}
function commitSellerBtn() {
  commitSeller(id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
    }
  });
}
</script>

<template>
  <div class="font-sans min-h-screen">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="router.back()">
      <template #title>
        <span class="text-lg font-bold">订单中心</span>
      </template>
    </van-nav-bar>
    <div
      v-if="(orderDetail.orderStatusName=='已取消'&&orderDetail.orderStatus=='4')||(orderDetail.orderStatusName=='付款超时'&&orderDetail.orderStatus=='5')||(orderDetail.orderStatusName=='已放行'&&orderDetail.orderStatus=='3')"
    >
      <div class="p-14px">
        <div class="font-bold">{{orderDetail.orderStatusName}}</div>
        <div class="flex items-center pt-18px">
          <van-image round width="2.5rem" height="2.5rem" :src="sellerHeader" />

          <span class="font-semibold ml-3">{{ sellerNickName || '' }}</span>
        </div>
        <div class="p-3 rounded-lg bg-[#ECF1F7] mt-14px">
          <div class="py-1 flex justify-between text-12px">
            <span class="text-gray-500">订单编号</span>
            <span class="text-gray-800 font-mono">{{ orderNumber || '' }}</span>
          </div>
          <div class="py-1 flex justify-between text-12px">
            <span class="text-gray-500">购买数量</span>
            <span class="text-gray-800 font-semibold">
              {{ money || 0 }}
              <span class="text-[#8A8A8D]">GUB</span>
            </span>
          </div>
          <div class="py-1 flex justify-between">
            <span class="text-gray-500 text-12px">付款金额</span>
            <span class="text-xl font-bold">¥ {{ money || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div>
        <van-steps :active="active">
          <van-step>订单已生成</van-step>
          <van-step>向卖家付款</van-step>
          <van-step>等待放行</van-step>
        </van-steps>
      </div>
      <div class="bg-white p-16px" style="height: 80vh;">
        <div v-if="orderDetail.orderStatus==='1'">
          <h1>向卖家付款</h1>
          <div class="flex text-12px">
            请在
            <van-count-down :time="getCountDownTime(createTime)" format="mm:ss" />内付款给卖家，请使用本人账号进行付款
          </div>
        </div>
        <div v-else>
          <h1>等待卖家放行</h1>
          <div class="flex text-12px">5:00后可发起申诉</div>
        </div>
        <div class="mb-6 flex items-center mt-10px" style="    justify-content: space-between;">
          <div class="flex items-center">
            <van-image round width="2.5rem" height="2.5rem" :src="sellerHeader" />

            <span class="font-semibold ml-3">{{ sellerNickName || '' }}</span>
          </div>
          <div>
            <van-button
              type="primary"
              size="small"
              class="!px-4"
              color="#0256FF"
              icon="https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png"
              @click="transactionReminderBtn"
            >交易提醒</van-button>
          </div>
        </div>
        <div class="bg-[#ECF1F7] p-14px" style="border-radius: 8px;">
          <div v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.bankName">
            <div class="text-12px flex items-center">
              <van-image :src="yinhangka" width="20px" height="20px"></van-image>银行卡支付
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">姓名</div>
              <div>
                <span class="text-14px text-[#000]">{{buyerNickName}}</span>
                <van-icon name="sign" @click="copyNum(buyerNickName)" />
              </div>
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">{{orderDetail.bankName}}账号</div>
              <div>
                <span class="text-14px text-[#000]">{{orderDetail.payAccount.bankCardNumber}}</span>
                <van-icon name="sign" @click="copyNum(orderDetail.payAccount.bankCardNumber)" />
              </div>
            </div>
          </div>
          <div v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.zfbAccount">
            <div class="text-12px flex items-center">
              <van-image :src="zhifubao" width="20px" height="20px"></van-image>支付宝支付
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">姓名</div>
              <div>
                <span class="text-14px text-[#000]">{{buyerNickName}}</span>
                <van-icon name="sign" @click="copyNum(buyerNickName)" />
              </div>
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">支付宝账号</div>
              <div>
                <span class="text-14px text-[#000]">{{orderDetail.payAccount.zfbAccount}}</span>
                <van-icon name="sign" @click="copyNum(orderDetail.payAccount.zfbAccount)" />
              </div>
            </div>
          </div>

          <div v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.wxAccount">
            <div class="text-12px flex items-center">
              <van-image :src="weixin" width="20px" height="20px"></van-image>微信支付
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">姓名</div>
              <div>
                <span class="text-14px text-[#000]">{{buyerNickName}}</span>
                <van-icon name="sign" @click="copyNum(buyerNickName)" />
              </div>
            </div>
            <div class="pt-19px flex justify-between text-12px">
              <div class="text-#8A8A8D">微信账号</div>
              <div>
                <span class="text-14px text-[#000]">{{orderDetail.payAccount.wxAccount}}</span>
                <van-icon name="sign" @click="copyNum(orderDetail.payAccount.wxAccount)" />
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 pb-0 pt-0 rounded-lg bg-[#ECF1F7] mt-14px">
          <div class="py-3 flex justify-between text-12px">
            <span class="text-gray-500">订单编号</span>
            <span class="text-gray-800 font-mono">{{ orderNumber || '' }}</span>
          </div>
          <div class="py-3 flex justify-between text-12px">
            <span class="text-gray-500">购买数量</span>
            <span class="text-gray-800 font-semibold">
              {{ money || 0 }}
              <span class="text-[#8A8A8D]">GUB</span>
            </span>
          </div>
          <div class="py-3 flex justify-between">
            <span class="text-gray-500">付款金额</span>
            <span class="text-xl font-bold">¥ {{ money || 0 }}</span>
          </div>
        </div>
        <div class="flex justify-around mt-20px" v-if="orderDetail.orderStatus==='1'">
          <div class="cancel-btn" @click="cancelOrderBtn">取消订单</div>
          <div class="confirm-btn" @click="commitSellerBtn">我已付款，通知卖家</div>
        </div>
        <div v-else>
          <div class="cancel-btntwo mt-20px" @click="cancelOrderBtn">取消订单</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* :deep(.van-nav-bar) {
  --van-nav-bar-background: #ecf1f7;
} */
:deep(.van-steps) {
  background: #ecf1f7;
}
:deep(.van-step__circle-container) {
  background: #ecf1f7;
}
:deep(.van-count-down) {
  color: #ff0808;
}
.cancel-btn {
  width: 137px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: #8a8a8d;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  color: #ffffff;
}
.confirm-btn {
  width: 199px;
  height: 40px;
  background: #0256ff;
  border-radius: 6px 6px 6px 6px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #ffffff;
}
.cancel-btntwo {
  width: 343px;
  height: 45px;
  background: #8a8a8d;
  border-radius: 6px 6px 6px 6px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #ffffff;
}
</style>
