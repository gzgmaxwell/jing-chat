<script setup lang="ts">
import { getCurUserInfo } from '@/api/user'
import { getBuyCoinsList, getSellCoinsList } from '@/api/sellbuycoin'
import { ResCode } from '@/utils/const'
import { useClipboard } from '@vueuse/core'

const userInfo = ref()
const buyCoinsList = ref([]) // 买币列表
const sellCoinsList = ref([]) // 卖币列表

// 使用useClipboard
const { copy, isSupported } = useClipboard()

// 获取用户信息
getCurUserInfo().then((res) => {
  userInfo.value = res.data
})
// 获取自己的买币列表
getBuyCoinsList({ orderStatus: '7' }).then((res) => {
  if (res.code === ResCode.SUCCESS) {
    buyCoinsList.value = res.data || []
  }
})
// 获取自己的卖币列表
getSellCoinsList({ orderStatus: '7' }).then((res) => {
  if (res.code === ResCode.SUCCESS) {
    sellCoinsList.value = res.data || []
  }
})

// 复制钱包地址逻辑
async function copyAddress() {
  if (!isSupported) {
    showToast('您的浏览器不支持复制功能')
    return
  }
  try {
    await copy(userInfo.value.walletAddress)
    showToast('钱包地址已复制')
  }
  catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请重试')
  }
}
/* function copyAddress() {
  navigator.clipboard.writeText(userInfo.value.walletAddress).then(() => {
    showToast('钱包地址已复制')
  })
} */
</script>

<template>
  <div class="font-sans bg-[#ECF1F7]">
    <!-- Header -->
    <div class="text-white px-4 py-2 bg-[#0256FF] flex items-center top-0 justify-between sticky z-10">
      <span />
      <div class="w-65x text-xl p-8px rounded-12.5px bg-[#0949AA] flex h-25px items-center space-x-3">
        <i class="i-carbon-headset text-16px" />
        <i class="i-carbon-email text-16px" />
      </div>
    </div>
    <van-notice-bar color="#1A1A1A" background="transparent" left-icon="volume-o" text="GUpay跨境加密货币金流服务，一个引领金融的钱包" />
    <!-- Banner Image -->
    <div class="p-4 pb-0 pt-0">
      <img src="../assets/banner.png" alt="Banner" class="rounded-8px h-128px w-full">
    </div>
    <main class="p-4 pt-8px">
      <!-- Balance Card -->
      <div class="p-4 rounded-lg bg-white">
        <div class="flex items-center justify-between">
          <span class="text-14px text-[#767676] font-semibold">{{ userInfo?.nickName || '' }}</span>
          <div class="text-xs ml-2 px-2 py-0.5 rounded-full flex items-center">
            <i class="i-carbon-checkmark-outline mr-1" />
            <span class="text-13px text-[#767676] text-align-center inline-block">已认证</span>
          </div>
        </div>

        <div class="mt-4">
          <span class="text-sm text-[#767676] inline-block">余额</span>
          <div class="mt-1 flex items-baseline justify-between">
            <div>
              <span class="text-3xl font-bold">{{ userInfo?.totalBalance || '0.00' }}</span>
              <span class="text-[#767676] ml-1">GUB</span>
            </div>
            <a href="#" class="text-sm text-blue-500">资金明细</a>
          </div>
        </div>

        <div class="mt-4 pb-4 pt-4 text-center border-t border-gray-200 grid grid-cols-3 divide-gray-200 divide-x">
          <div>
            <p class="text-lg font-bold">
              {{ userInfo?.sellOrderBalance || '0' }} <span class="text-xs font-normal">GUB</span>
            </p>
            <p class="text-xs text-[#8A8A8D] mt-1">
              卖单余额
            </p>
          </div>
          <div>
            <p class="text-lg font-bold">
              {{ userInfo?.inTheProcessOfBuyingCoins || '0' }} <span class="text-xs font-normal">GUB</span>
            </p>
            <p class="text-xs text-[#8A8A8D] mt-1">
              买币交易中
            </p>
          </div>
          <div>
            <p class="text-lg font-bold">
              {{ userInfo?.sellingCoinsInTrading || '0' }} <span class="text-xs font-normal">GUB</span>
            </p>
            <p class="text-xs text-[#8A8A8D] mt-1">
              卖币交易中
            </p>
          </div>
        </div>
        <!-- Wallet Address -->
        <div
          class="pt-3 border-t-1 border-[#E5E5E5] rounded-lg border-solid bg-white flex items-center justify-between"
        >
          <div class="text-sm flex items-center">
            <i class="i-carbon-wallet text-lg mr-2" />
            <span class="text-[#767676]">钱包地址:</span>
            <span class="text=[#1A1A1A] font-mono ml-2 max-w-45% truncate">{{ userInfo?.walletAddress || '' }}</span>
            <i class="i-carbon-copy text-[#0256FF] ml-1 cursor-pointer" @click="copyAddress()" />
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div class="mt-8px rounded-lg bg-white">
        <div class="mt-4 rounded-lg bg-white shadow-md">
          <!--
      卡片头部区域。
      使用 flex 布局实现标题和按钮的两端对齐。
    -->
          <div class="p-4 pb-0 flex items-center justify-between">
            <h3 class="text-base font-bold">
              我的挂单
            </h3>
            <!-- Vant 的按钮组件，通过 class 属性和 UnoCSS 的 ! 前缀来覆盖默认样式，实现完全圆角。 -->
            <van-button v-show="false" icon="gold-coin-o" type="warning" size="small" class="!px-3 !rounded-full">
              搬砖赚钱
            </van-button>
          </div>

          <!--
      “买币”列表区域。
      使用 border-t 来添加与头部的分割线。
    -->
          <div>
            <!-- 列表的标题 -->
            <div class="px-4 pt-4">
              <div class="text-sm text-[#8A8A8D] font-semibold p-2 pb-1 pt-1 rounded-4px bg-[#ECF1F7]">
                买币
              </div>
            </div>
            <div class="text-sm text-[#8A8A8D] px-1 py-2 text-center flex gap-4">
              <span class="w-50%">订单号</span>
              <span class="w-25%">金额</span>
              <span class="w-25%">状态</span>
            </div>
            <div v-if="!!buyCoinsList.length">
              <div
                v-for="item in buyCoinsList" :key="item.id"
                class="custom-font text-10px text-sm px-4 py-1 text-center flex gap-4"
              >
                <span class="w-50%">{{ item.id || '' }}</span>
                <span class="w-25%">{{ item.money || '0.00' }}<span class="text-[#8A8A8D]">GUB</span></span>
                <span class="w-25%">{{ item.orderStatusName || '' }}</span>
              </div>
            </div>
            <van-empty v-else image="search" image-size="60" description="暂无数据" class="pb-8 pt-4" />
          </div>

          <!--
      “卖币”列表区域，结构与“买币”完全相同。
    -->
          <div class="border-t border-gray-100">
            <div class="px-4 pt-4">
              <div class="text-sm text-[#8A8A8D] font-semibold p-2 pb-1 pt-1 rounded-4px bg-[#ECF1F7]">
                卖币
              </div>
            </div>
            <div class="text-sm text-[#8A8A8D] px-1 py-2 text-center flex gap-4">
              <span class="w-50%">订单号</span>
              <span class="w-25%">金额</span>
              <span class="w-25%">状态</span>
            </div>
            <div v-if="!!sellCoinsList.length">
              <div
                v-for="item in sellCoinsList" :key="item.id"
                class="custom-font text-10px text-sm px-4 py-1 text-center flex gap-4"
              >
                <span class="w-50%">{{ item.id || '' }}</span>
                <span class="w-25%">{{ item.money || '0.00' }}<span class="text-[#8A8A8D]">GUB</span></span>
                <span class="w-25%">{{ item.orderStatusName || '' }}</span>
              </div>
            </div>
            <van-empty v-else image="search" image-size="60" description="暂无数据" class="pb-8 pt-4" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-font {
  font-family: 'Alibaba PuHuiTi 2.0-55 Regular';
  font-weight: 400;
}
</style>

<route lang="json5">
{
  name: 'Main'
}
</route>
