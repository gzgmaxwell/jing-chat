<script setup lang="ts">
import { getBuyCoinsList, getSellCoinsList } from '@/api/sellbuycoin'
import type { BuyCoinsListQuery, quickBuyCoins, SellCoinsListMyself } from '@/api/sellbuycoin'
import { ResCode } from '@/utils/const'
import router from '@/router'
import { useRoute } from "vue-router";
const route = useRoute();
const buyType = ref('select') // 'select' for 买币, 'quick' for 卖币
const activeStatusTabBuy = ref(0) // 0 for 进行中, 1 for 已完成
const activeStatusTabSell = ref(0)

const switcherRef = ref<HTMLElement | null>(null)
const switcherHeight = ref(0)

const buyCoinsList = ref([]) // 买币列表
const sellCoinsList = ref([]) // 卖币列表

/* 买币列表 */
queryBuyCoinsList()
function queryBuyCoinsList(status = '7') {
  getBuyCoinsList({ orderStatus: status as BuyCoinsListQuery['orderStatus'] }).then((res) => {
    if (res?.code === ResCode.SUCCESS) {
      buyCoinsList.value = res?.data || []
    }
  })
}
/* 卖币列表 */
function querySellCoinsList(status = '7') {
  getSellCoinsList({ orderStatus: status as SellCoinsListMyself['orderStatus'] }).then((res) => {
    if (res?.code === ResCode.SUCCESS) {
      sellCoinsList.value = res?.data || []
    }
  })
}
// 买币tab切换
function buyTabChanged(index: number) {
  const status = index === 0 ? '7' : '8'
  queryBuyCoinsList(status)
}
// 卖币tab切换
function sellTabChanged(index: number) {
  const status = index === 0 ? '7' : '8'
  querySellCoinsList(status)
}

watch(buyType, (newType) => {
  // 切换买币卖币时，重置tab为进行中
  if (newType === 'select') {
    queryBuyCoinsList('7')
  }
  else if (newType === 'quick') {
    querySellCoinsList('7')
  }
})

onMounted(() => {
  // The default height of van-nav-bar is 46px
  const navBarHeight = 46
  if (switcherRef.value) {
    // Set the top position for the switcher itself
    switcherRef.value.style.top = `${navBarHeight}px`
    // Calculate the offset for the tabs below the switcher
    nextTick(() => {
      switcherHeight.value = navBarHeight + switcherRef.value!.offsetHeight
    })
  }
  const content = route.query.data ? route.query.data : "";
  if(content === '卖币'){

      buyType.value='quick'
  }else {
          buyType.value='select'
  }
})
</script>

<template>
  <div class="font-sans bg-[#ECF1F7] min-h-screen">
    <!-- <van-nav-bar left-arrow title="账单中心" placeholder fixed @click-left="router.back()" /> -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="router.back()">
      <template #title>
        <span class="text-lg text-white font-bold">账单中心</span>
      </template>
    </van-nav-bar>
    <div class="rounded-t-lg">
      <div
        ref="switcherRef"
        class="text-lg font-bold pl-4 pr-4 border-b border-gray-100 bg-[#ECF1F7] flex gap-2 items-center top-0 sticky z-10 mt-18px"
      >
        <span
          :class="buyType === 'select' ? 'text-[#000]' : 'text-[#8A8A8D]'"
          class="cursor-pointer"
          @click="buyType = 'select'"
        >买币</span>
        <span class="text-gray-300">|</span>
        <span
          :class="buyType === 'quick' ? 'text-[#000]' : 'text-[#8A8A8D]'"
          class="cursor-pointer"
          @click="buyType = 'quick'"
        >卖币</span>
      </div>

      <!-- 买币 Content -->
      <div v-show="buyType === 'select'">
        <van-tabs
          v-model:active="activeStatusTabBuy"
          shrink
          type="line"
          class="sub-tabs"
          sticky
          :offset-top="switcherHeight"
          title-active-color="#0256FF"
          background="#ECF1F7"
          @change="buyTabChanged"
        >
          <van-tab title="进行中">
            <template v-if="!!buyCoinsList.length">
              <order-detail v-for="order in buyCoinsList" :key="order.id" :order-detail="order" />
            </template>
            <van-empty v-else image-size="80" description="暂无数据" />
          </van-tab>
          <van-tab title="已完成">
            <template v-if="!!buyCoinsList.length">
              <order-detail v-for="order in buyCoinsList" :key="order.id" :order-detail="order" />
            </template>
            <van-empty v-else image-size="80" description="暂无数据" />
          </van-tab>
        </van-tabs>
      </div>

      <!-- 卖币 Content -->
      <div v-show="buyType === 'quick'">
        <van-tabs
          v-model:active="activeStatusTabSell"
          background="#ECF1F7"
          type="line"
          class="sub-tabs"
          :offset-top="switcherHeight"
          title-active-color="#0256FF"
          shrink
          sticky
          @change="sellTabChanged"
        >
          <van-tab title="进行中">
            <template v-if="!!sellCoinsList.length">
              <sell-order-detail
                v-for="order in sellCoinsList"
                :key="order.id"
                :order-detail="order"
              />
            </template>
            <van-empty v-else image-size="80" description="暂无数据" />
          </van-tab>
          <van-tab title="已完成">
            <template v-if="!!sellCoinsList.length">
              <sell-order-detail
                v-for="order in sellCoinsList"
                :key="order.id"
                :order-detail="order"
              />
            </template>
            <van-empty v-else image-size="80" description="暂无数据" />
          </van-tab>
          <!--  <van-tab title="进行中">
            <div class="p-4">
              <van-empty image-size="80" description="暂无数据" />
            </div>
          </van-tab>
          <van-tab title="已完成">
            <div class="p-4">
              <van-empty image-size="80" description="暂无数据" />
            </div>
          </van-tab>-->
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* A little style to remove the default padding from sub-tabs for a cleaner look */
.sub-tabs .van-tabs__content {
  padding: 0;
}
:deep(.van-nav-bar) {
  background: #0256ff;
}
</style>
<!--
<route lang="json5">
{
  name: 'Order'
}
</route> -->
