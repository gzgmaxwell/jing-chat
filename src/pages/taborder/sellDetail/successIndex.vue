<script setup lang="ts">
import router from "@/router";
import { ResCode } from "@/utils/const";
import { getBuyCoinsDetail, buyCoinsContact } from "@/api/sellbuycoin";
import { useClipboard } from "@vueuse/core";
import yinhangka from "../../../assets/trade/yinhangka.png";
import weixin from "../../../assets/trade/weixin.png";
import zhifubao from "../../../assets/trade/zhifubao.png";
import { rsaEncrypt } from "@/utils/jsencryptUtil";
import { useRoute } from "vue-router";
const route = useRoute();
const { copy, isSupported } = useClipboard();
const data = route.query;
console.log("uuuuu",data.data);
const isLogoutShow = ref(false);
const orderDetail = ref({});
const onClickLeft = () => router.back();

onMounted(() => {
  queryBuyDetail();
});

function queryBuyDetail() {
  getBuyCoinsDetail(data.data).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      orderDetail.value = res.data;
    }
  });
}
function getCountDownTime(createTimeStr: string): number {
  const createTimestamp = new Date(createTimeStr.replace(/-/g, "/")).getTime();
  const now = Date.now();
  const fifteenMinutes = 15 * 60 * 1000;
  const endTime = createTimestamp + fifteenMinutes;
  const remainTime = endTime - now;
  return remainTime > 0 ? remainTime : 0;
}
function transactionReminderBtn() {
  buyCoinsContact(orderDetail.value.id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
    }
  });
}
async function copyNum(value) {
  if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {
    await copy(value);
    showToast("订单编号已复制");
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
}
</script>

<template>
  <div>
        <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="router.back()">
   
    </van-nav-bar>
    <div class="bg-white p-16px" style="height: 80vh;">
       <div class="p-12px">
        <div class="flex item-center">
          <div class="text-#8A8A8D text-12px">订单编号</div>
          <div class="text-13px ml-8px">{{orderDetail.id}}</div>
        </div>
        <div class="flex item-center mt-14px justify-between">
          <div class="flex">
            <div class="text-#8A8A8D text-12px">挂单金额</div>
            <div class="text-13px ml-8px">{{orderDetail.money}}GUB</div>
          </div>
          <div class="text-12px text-[#5dffbd]">{{ orderDetail.cfcfName }}</div>
        </div>
      </div>
      <div class="text-16px font-bold">
        交易成功
      </div>
      <div class="text-12px" >已完成</div>
      <div class="mb-6 flex items-center mt-10px" style="    justify-content: space-between;">
        <div class="flex items-center">
          <van-image round width="2.5rem" height="2.5rem" :src="orderDetail.sellerHeader" />

          <span class="font-semibold ml-3">{{ orderDetail.sellerNickName || '' }}</span>
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
              <span class="text-14px text-[#000]">{{orderDetail.buyerNickName}}</span>
              <van-icon name="sign" @click="copyNum(orderDetail.buyerNickName)" />
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
        <div v-else-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.zfbAccount">
          <div class="text-12px flex items-center">
            <van-image :src="zhifubao" width="20px" height="20px"></van-image>支付宝支付
          </div>
          <div class="pt-19px flex justify-between text-12px">
            <div class="text-#8A8A8D">姓名</div>
            <div>
              <span class="text-14px text-[#000]">{{orderDetail.buyerNickName}}</span>
              <van-icon name="sign" @click="copyNum(orderDetail.buyerNickName)" />
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

        <div v-else>
          <div class="text-12px flex items-center">
            <van-image :src="weixin" width="20px" height="20px"></van-image>微信支付
          </div>
          <div class="pt-19px flex justify-between text-12px">
            <div class="text-#8A8A8D">姓名</div>
            <div>
              <span class="text-14px text-[#000]">{{orderDetail.buyerNickName}}</span>
              <van-icon name="sign" @click="copyNum(orderDetail.buyerNickName)" />
            </div>
          </div>
          <div class="pt-19px flex justify-between text-12px">
            <div class="text-#8A8A8D">微信账号</div>
            <div>
              <span class="text-14px text-[#000]">{{orderDetail.payAccount?orderDetail.payAccount.wxAccount:''}}</span>
              <van-icon name="sign" @click="copyNum(orderDetail.payAccount?orderDetail.payAccount.wxAccount:'')" />
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 pb-0 pt-0 rounded-lg bg-[#ECF1F7] mt-14px">
        <div class="py-3 flex justify-between text-12px">
          <span class="text-gray-500">订单编号</span>
          <span class="text-gray-800 font-mono">{{ orderDetail.orderNumber || '' }}</span>
        </div>
        <div class="py-3 flex justify-between text-12px">
          <span class="text-gray-500">购买数量</span>
          <span class="text-gray-800 font-semibold">
            {{ orderDetail.money || 0 }}
            <span class="text-[#8A8A8D]">GUB</span>
          </span>
        </div>
        <div class="py-3 flex justify-between">
          <span class="text-gray-500">付款金额</span>
          <span class="text-xl font-bold">¥ {{ orderDetail.money || 0 }}</span>
        </div>
      </div>
    </div>
          <div
        
          class="cancel-btntwo mt-20px"
          style="  background: #0256ff;"
       @click="router.back()"
        >确定</div>
        
  </div>
</template>
<style lang="scss" scoped>
.about-content {
  padding: 12px 26px;
  font-size: 12px;
  color: #000000;
  line-height: 17px;
}
.cancel-btntwo {
margin: 0 20px;
  height: 45px;
  background: #8a8a8d;
  border-radius: 6px 6px 6px 6px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  color: #ffffff;
}
</style>