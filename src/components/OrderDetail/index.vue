<script setup lang="ts">
import router from "@/router";
import { useClipboard } from "@vueuse/core";

const props = defineProps<OrderDetailProps>();

// 使用useClipboard
const { copy, isSupported } = useClipboard();
const time = ref(15 * 60 * 1000);

interface OrderDetailProps {
  orderDetail?: {
    createTime: string;
    orderStatusName: string;
    money: number;
    orderNumber: string;
    buyerId: string;
    sellerHeader: string;
    sellerNickName: string;
    buyerNickName: string;
    id: string;
    orderStatus: string;
  };
}
const {
  id = "",
  createTime = "", // 下单时间
  orderStatusName = "", // 订单状态
  money = 0, // 订单金额
  orderNumber = "", // 订单编号
  buyerId = "", // 购买人用户ID
  sellerHeader = "", // 卖家头像
  sellerNickName = "",
  buyerNickName = "",
  orderStatus = ""
} = props.orderDetail || {};

function jumpToDetail() {
  router.push({
    path: "/taborder/detail",
    query: {
      id,
      sellerHeader,
      orderStatusName,
      money,
      orderNumber,
      buyerId,
      createTime,
      sellerNickName,
      buyerNickName
    }
  });
}

// 复制订单编号
async function copyNum() {
  if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {
    await copy(orderNumber);
    showToast("订单编号已复制");
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
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
</script>

<template>
  <div class="p-4 pb-0 pt-2 bg-[#ECF1F7]">
    <!-- Order Card -->
    <div class="text-[#8A8A8D] mb-4 p-4 rounded-lg bg-white">
      <div class="text-sm flex items-center justify-between">
        <span>{{ createTime }}</span>
        <span>{{ orderStatusName }}</span>
      </div>
      <div>
        <div class="flex justify-between">
          <div class="text-xs line-height-50px h-50px">订单金额</div>
          <div class="text-18px text-[#000] line-height-45px font-semibold h-45px">{{ money }} GUB</div>
        </div>
        <div class="flex justify-between">
          <div class="text-xs line-height-30px h-30px">订单编号</div>
          <div class="text-sm font-mono flex items-center">
            <span class="text-12px text-[#000] line-height-30px h-30px">{{ orderNumber }}</span>
            <i class="i-carbon-copy text-[#0256FF] ml-2 cursor-pointer" @click="copyNum" />
          </div>
        </div>
      </div>
      <div class="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div class="flex">
          <van-image round width="1.5rem" height="1.5rem" :src="sellerHeader" />
          <span class="text-sm text-[#000] font-semibold ml-2">{{ sellerNickName }}</span>
        </div>
        <!--  -->
        <div class="flex">
          <div
            class="flex items-center text-12px mr-12px"
            style="color:red; "
            v-if="getCountDownTime(createTime) > 0 &&orderStatus==='1'"
          >
            倒计时
            <van-count-down :time="getCountDownTime(createTime)" format="mm:ss" />
          </div>
          <van-button
            type="primary"
            size="small"
            class="!px-4"
            color="#0256FF"
            @click="jumpToDetail"
          >订单详情</van-button>
        </div>
      </div>
    </div>
    <!-- You can add more order cards here -->
  </div>
</template>
       <style scoped lang="scss">
:deep(.van-count-down) {
  color: #ff0808;
}
</style>
