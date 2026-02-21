<script setup lang="ts">
import { ref } from 'vue'

// 底部Tab激活状态
const activeTab = ref('home')

// 复制钱包地址逻辑
function copyAddress() {
  navigator.clipboard.writeText('3fad8ac341d14327').then(() => {
    console.log('地址已复制') // 可替换为Toast提示
  })
}
</script>

<template>
  <div class="page-container">
    <!-- 1. 顶部状态栏（模拟） -->
    <div class="status-bar text-white px-4 py-2 bg-blue-600 flex items-center justify-between">
      <span class="text-lg font-bold">9:41</span>
      <div class="flex items-center">
        <span class="mr-2">▨▨▨</span>
        <span>WiFi</span>
        <span class="ml-2">电池</span>
      </div>
    </div>

    <!-- 2. 广告横幅 -->
    <div class="ad-banner">
      <img src="https://picsum.photos/800/200" alt="GUpay广告" class="h-auto w-full">
    </div>

    <!-- 3. 用户信息卡片 -->
    <div class="user-card mb-4 p-4 rounded-lg bg-white shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <span>02200SLR</span>
        <div class="text-xs text-green-600 px-2 py-1 rounded bg-green-100 flex items-center">
          <VanIcon name="check-circle" class="mr-1" />
          <span>已认证</span>
        </div>
      </div>
      <div class="mb-4 text-center">
        <p class="text-gray-500">
          余额
        </p>
        <p class="text-3xl font-bold">
          0.00 GUB
        </p>
        <VanButton type="text" class="text-blue-600 mt-2">
          资金明细
        </VanButton>
      </div>
      <div class="text-center gap-2 grid grid-cols-3">
        <div>
          <p class="text-lg font-bold">
            0 GUB
          </p>
          <p class="text-sm text-gray-500">
            卖单余额
          </p>
        </div>
        <div>
          <p class="text-lg font-bold">
            500 GUB
          </p>
          <p class="text-sm text-gray-500">
            买币交易中
          </p>
        </div>
        <div>
          <p class="text-lg font-bold">
            0 GUB
          </p>
          <p class="text-sm text-gray-500">
            卖币交易中
          </p>
        </div>
      </div>
    </div>

    <!-- 4. 钱包地址 -->
    <div class="wallet-address mb-4 p-4 rounded-lg bg-white flex shadow-sm items-center justify-between">
      <div class="flex items-center">
        <VanIcon name="folder-o" class="text-gray-500 mr-2" />
        <span>钱包地址: 3fad8ac341d14327</span>
      </div>
      <VanIcon name="copy" class="text-blue-600" @click="copyAddress" />
    </div>

    <!-- 5. 我的挂单 -->
    <div class="order-section mb-4 p-4 rounded-lg bg-white shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-bold">
          我的挂单
        </h3>
        <VanButton size="small" type="warning" class="flex items-center">
          <VanIcon name="user" class="mr-1" />
          搬砖赚钱
        </VanButton>
      </div>

      <!-- 买币订单 -->
      <div class="order-tab mb-4">
        <h4 class="font-bold mb-2">
          买币
        </h4>
        <VanEmpty description="暂无数据" />
      </div>

      <!-- 卖币订单 -->
      <div class="order-tab">
        <h4 class="font-bold mb-2">
          卖币
        </h4>
        <VanEmpty description="暂无数据" />
      </div>
    </div>

    <!-- 6. 底部Tab栏 -->
    <VanTabbar v-model="activeTab" class="bg-white shadow-lg bottom-0 left-0 right-0 fixed">
      <VanTabbarItem icon="home-o" name="home">
        首页
      </VanTabbarItem>
      <VanTabbarItem icon="exchange" name="trade">
        交易
      </VanTabbarItem>
      <VanTabbarItem icon="scan" name="scan">
        扫码
      </VanTabbarItem>
      <VanTabbarItem icon="file-text-o" name="order">
        订单
      </VanTabbarItem>
      <VanTabbarItem icon="user-o" name="mine">
        我的
      </VanTabbarItem>
    </VanTabbar>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 50px; /* 底部Tab栏高度，避免内容被遮挡 */
}

.ad-banner {
  margin: 0 10px 10px;
}

.order-tab {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>

<route lang="json5">
{
  name: 'Concat'
}
</route>
