<script setup lang="ts">
import router from '@/router'
import { useClipboard } from '@vueuse/core'
// import { getSellCoinsDetail } from '@/api/sellbuycoin'
const props = defineProps<OrderDetailProps>()

// 使用useClipboard
const { copy, isSupported } = useClipboard()

interface OrderDetailProps {
  orderDetail?: {
    id:string
    createTime: string
    updateTime:string
    orderStatusName: string
    money: number
    hangingOrderNumber: string
    sellerId: string
    sellerHeader: string
    balance: number
  }
}
const {
  id='',
  updateTime='',
  createTime = '', // 下单时间
  orderStatusName = '', // 订单状态
  money = 0, // 订单金额
  hangingOrderNumber = '', // 订单编号
  sellerId = '', // 购买人用户ID
  sellerHeader = '', // 卖家头像
  balance=0,
} = props.orderDetail || {}

function jumpToDetail() {
  router.push({
    path: '/taborder/sellDetail',
    query: { sellerHeader, orderStatusName, money, hangingOrderNumber, sellerId,id },
  })
}

// 复制订单编号
async function copyNum() {
  if (!isSupported) {
    showToast('您的浏览器不支持复制功能')
    return
  }
  try {
    await copy(hangingOrderNumber)
    showToast('订单编号已复制')
  }
  catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请重试')
  }
}
</script>

<template>
  <div class="p-4 pb-0 pt-2 bg-[#ECF1F7]">
    <!-- Order Card -->
    <div class="text-[#8A8A8D] mb-4 p-4 rounded-lg bg-white">
      <div class="text-sm flex items-center justify-between">
        <span>{{ updateTime }}</span>
        <span style="color: red;">{{ orderStatusName }}</span>
      </div>
      <div class="mt-20px">
        <div class="flex justify-between">
          <div class="text-12px ">
            挂单金额
          </div>
          <div class="text-18px text-[#000]  font-semibold ">
            {{ money }} GUB
          </div>
        </div>
         <div class="flex justify-between mt-20px">
          <div class="text-xs ">
            剩余金额
          </div>
          <div class="text-18px text-[#000]  font-semibold ">
            {{ balance }} GUB
          </div>
        </div>
         <!-- <div class="flex justify-between">
          <div class="text-xs line-height-35px h-35px">
            额外奖励
          </div>
          <div class="text-18px text-[#000] line-height-35px font-semibold h-45px">
            {{ money }} GUB
          </div>
        </div> -->
        <div class="flex justify-between mt-20px" >
          <div class="text-xs ">
            订单编号
          </div>
          <div class="text-sm font-mono flex items-center">
            <span class="text-12px text-[#000] ">{{ hangingOrderNumber }}</span>
            <i class="i-carbon-copy text-[#0256FF] ml-2 cursor-pointer" @click="copyNum" />
          </div>
        </div>
      </div>
      <div class="pt-3 border-t border-gray-100 flex items-center justify-end">
        <!-- <div class="flex items-center">
          <van-image round width="1.5rem" height="1.5rem" :src="sellerHeader" />
          <span class="text-sm text-[#000] font-semibold ml-2">{{ sellerId }}</span>
        </div> -->
        <van-button type="primary" size="small" class="!px-4" color="#0256FF" @click="jumpToDetail">
          订单详情
        </van-button>
      </div>
    </div>
    <!-- You can add more order cards here -->
  </div>
</template>
