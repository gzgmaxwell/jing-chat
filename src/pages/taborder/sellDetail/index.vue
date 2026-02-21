<script setup lang="ts">
import router from "@/router";
import { useRoute } from "vue-router";
import {
  getSellCoinsDetail,
  buyCoinsContact,
  cancelSellOrder,
  commitBuyCoins,
  getBuyCoinsDetail
} from "@/api/sellbuycoin";
import { ResCode } from "@/utils/const";
const active = ref(0);
const route = useRoute();
import { useClipboard } from "@vueuse/core";
import yinhangka from "../../../assets/trade/yinhangka.png";
import weixin from "../../../assets/trade/weixin.png";
import zhifubao from "../../../assets/trade/zhifubao.png";
import { rsaEncrypt } from "@/utils/jsencryptUtil";
// 使用useClipboard
const { copy, isSupported } = useClipboard();
const {
  sellerHeader,
  orderStatusName,
  money,
  hangingOrderNumber,
  sellerId,
  id
} = route.query;
const payPassword = ref(false);
const zfmm = ref("");
const orderDetail = ref({});
const orderDetailAll = ref({});
onMounted(() => {
  queryBuyCoinsList();
});
function queryBuyCoinsList() {
  getSellCoinsDetail(id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data.buys[res.data.buys.length - 1]);
      let objectStr = res.data.buys[res.data.buys.length - 1];
      console.log("object", objectStr);
      queryBuyDetail(objectStr.id);
      orderDetailAll.value = res.data;
      if (objectStr.orderStatus === "1") {
        active.value = 0;
      } else if (objectStr.orderStatus === "2") {
        active.value = 2;
      }
    }
  });
}
function queryBuyDetail(id) {
  getBuyCoinsDetail(id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      orderDetail.value = res.data;
    }
  });
}
function onClickLeft() {
  router.back();
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
function cancelOrderBtn() {
  console.log("orderDetailAll.id", orderDetailAll.value.id);
  cancelSellOrder(orderDetailAll.value.id).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
      router.back();
    }
  });
}
function onSubmitBtn() {
  commitBuyCoins({
    id: orderDetail.value.id,
    zfmm: rsaEncrypt(zfmm.value.trim()) as string
  }).then(res => {
    if (res?.code === ResCode.SUCCESS) {
      console.log("res", res.data);
      showToast(res.msg);
      payPassword.value = false;
      router.push({
        path: "/taborder/sellDetail/successIndex",
        query: { data: orderDetail.value.id }
      });
      //  queryBuyCoinsList();
      // router.back();
    }
  });
}
 function detailBtn(id){
    router.push({
        path: "/taborder/sellDetail/successIndex",
        query: { data:id }
      });
}
</script>

<template>
  <div class="font-sans bg-white min-h-screen">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="router.back()">
      <template #title>
        <span class="text-lg font-bold">订单中心</span>
      </template>
    </van-nav-bar>
    <!-- 挂单中 -->
    <div v-if="orderDetailAll.orderStatus==='1'&&orderDetailAll.orderStatusName==='挂单中'" class>
      <div class="flex justify-between p-12px">
        <div>
          <div class="flex item-center">
            <div class="text-#8A8A8D text-12px">挂单编号</div>
            <div class="text-13px ml-8px">{{orderDetailAll.id}}</div>
          </div>
          <div class="flex item-center mt-14px">
            <div class="text-#8A8A8D text-12px">挂单金额</div>
            <div class="text-13px ml-8px">{{orderDetailAll.money}}</div>
          </div>
          <div class="flex item-center mt-14px">
            <div class="text-#8A8A8D text-12px">剩余金额</div>
            <div class="text-13px ml-8px">{{orderDetailAll.balance}}</div>
          </div>
        </div>
        <div class="text-red">挂单中</div>
      </div>
      <div class="bg-#e7f4ff" style="height: 80vh;
    overflow: auto;">
        <div v-for="order in orderDetailAll.buys" :key="order.id" :order-detail="order">
          <div class="text-[#8A8A8D] mb-4 p-4 rounded-lg">
            <div class="text-sm flex items-center justify-between">
              <span>{{ order.createTime }}</span>
              <span>{{ order.orderStatusName }}</span>
            </div>
            <div>
              <div class="flex justify-between">
                <div class="text-xs line-height-50px h-50px">订单金额</div>
                <div
                  class="text-18px text-[#000] line-height-45px font-semibold h-45px"
                >{{ order.money }} GUB</div>
              </div>
              <div class="flex justify-between">
                <div class="text-xs line-height-30px h-30px">订单编号</div>
                <div class="text-sm font-mono flex items-center">
                  <span
                    class="text-12px text-[#000] line-height-30px h-30px"
                  >{{ order.orderNumber }}</span>
                  <i
                    class="i-carbon-copy text-[#0256FF] ml-2 cursor-pointer"
                    @click="copyNum( order.orderNumber)"
                  />
                </div>
              </div>
            </div>
            <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div class="flex">
                <van-image round width="1.5rem" height="1.5rem" :src="order.sellerHeader" />
                <span class="text-sm text-[#000] font-semibold ml-2">{{ order.sellerNickName }}</span>
              </div>
              <div v-if="order.orderStatus==='3'&&order.orderStatusName==='已放行'">
                 <van-button type="primary" size="small" class="!px-4" color="#0256FF" @click="detailBtn(order.id)">
          订单详情
        </van-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else-if="(orderDetailAll.orderStatusName=='已取消'&&orderDetailAll.orderStatus=='4')||(orderDetailAll.orderStatusName=='付款超时'&&orderDetailAll.orderStatus=='5')"
    >
      <div class="p-14px">
        <div class="font-bold">{{orderDetailAll.orderStatusName}}</div>
        <div class="flex items-center pt-18px">
          <van-image round width="2.5rem" height="2.5rem" :src="orderDetailAll.sellerHeader" />

          <span class="font-semibold ml-3">{{ orderDetailAll.sellerNickName || '' }}</span>
        </div>
        <div class="p-3 rounded-lg bg-[#ECF1F7] mt-14px">
          <div class="py-1 flex justify-between text-12px">
            <span class="text-gray-500">订单编号</span>
            <span class="text-gray-800 font-mono">{{ orderDetailAll.id || '' }}</span>
          </div>
          <div class="py-1 flex justify-between text-12px">
            <span class="text-gray-500">购买数量</span>
            <span class="text-gray-800 font-semibold">
              {{ orderDetailAll.money || 0 }}
              <span class="text-[#8A8A8D]">GUB</span>
            </span>
          </div>
          <div class="py-1 flex justify-between">
            <span class="text-gray-500 text-12px">付款金额</span>
            <span class="text-xl font-bold">¥ {{ orderDetailAll.money || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 交易中 -->
    <div v-else>
      <div class="p-12px">
        <div class="flex item-center">
          <div class="text-#8A8A8D text-12px">订单编号</div>
          <div class="text-13px ml-8px">{{orderDetailAll.id}}</div>
        </div>
        <div class="flex item-center mt-14px justify-between">
          <div class="flex">
            <div class="text-#8A8A8D text-12px">挂单金额</div>
            <div class="text-13px ml-8px">{{orderDetailAll.money}}GUB</div>
          </div>
          <div class="text-12px text-[#5dffbd]">{{ orderDetailAll.cfcfName }}</div>
        </div>
      </div>

      <div>
        <van-steps :active="active">
          <van-step>订单已生成</van-step>
          <van-step>等待买家付款</van-step>
          <van-step>等待放行</van-step>
        </van-steps>
      </div>
      <div class="bg-white p-16px" style="height: 80vh;">
        <div v-if="orderDetail.orderStatus==='1'">
          <h1>订单已生成</h1>
          <div class="flex text-12px">
            在
            <van-count-down :time="getCountDownTime(orderDetail.createTime)" format="mm:ss" />后交易取消
          </div>
        </div>
        <div v-else>
          <h1>等待卖家放行</h1>
          <div class="flex text-12px">5:00后可发起申诉</div>
        </div>
        <div class="mb-6 flex items-center mt-10px" style="    justify-content: space-between;">
          <div class="flex items-center">
            <van-image round width="2.5rem" height="2.5rem" :src="orderDetail.buyerHeader" />

            <span class="font-semibold ml-3">{{ orderDetail.buyerNickName || '' }}</span>
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

        <div>
          <div
            class="bg-[#ECF1F7] p-14px"
            style="border-radius: 8px;"
            v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.bankName"
          >
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
          <div
            class="bg-[#ECF1F7] p-14px"
            style="border-radius: 8px;"
            v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.zfbAccount"
          >
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

          <div
            class="bg-[#ECF1F7] p-14px"
            style="border-radius: 8px;"
            v-if="orderDetail&&orderDetail?.payAccount &&orderDetail?.payAccount.wxAccount"
          >
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
                <span class="text-14px text-[#000]">{{orderDetail.payAccount.wxAccount}}</span>
                <van-icon name="sign" @click="copyNum(orderDetail.payAccount.wxAccount)" />
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
            <span class="text-gray-500">出售数量</span>
            <span class="text-gray-800 font-semibold">
              {{ orderDetail.money || 0 }}
              <span class="text-[#8A8A8D]">GUB</span>
            </span>
          </div>
          <div class="py-3 flex justify-between">
            <span class="text-gray-500 text-12px">付款金额</span>
            <span class="text-xl font-bold">¥ {{ orderDetail.money || 0 }}</span>
          </div>
        </div>
        <div
          v-if="orderDetail.orderStatus==='2'&&orderDetailAll.orderStatus==='2'"
          class="cancel-btntwo mt-20px"
          style="  background: #0256ff;"
          @click="payPassword=true"
        >放行</div>
        <div class="cancel-btntwo mt-20px" @click="cancelOrderBtn" v-else>取消订单</div>
      </div>
    </div>
    <van-popup
      v-model:show="payPassword"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
    >
      <div class="text-center">
        <h1 class="font-bold mb-4">身份验证</h1>
      </div>

      <van-cell-group>
        <van-field v-model="zfmm" placeholder="输入支付密码" class="bg-[#F7F8FA]"></van-field>
      </van-cell-group>

      <div @click="onSubmitBtn">
        <van-button block color="#0256FF" class="rounded-lg">提交</van-button>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
:deep(.van-nav-bar) {
  --van-nav-bar-background: white;
}
:deep(.van-count-down) {
  color: #ff0808;
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
