<script setup lang="ts">
import { ref } from 'vue'
import { buyCoins, getPayType, getSellCoinsListAll, quickBuyCoins, sellCoins } from '@/api/sellbuycoin'
import type { SellCoinsListAll } from '@/api/sellbuycoin'
import { ResCode } from '@/utils/const'
import { getCurUserInfo } from '@/api/user'
import { rsaEncrypt } from '@/utils/jsencryptUtil'
import yinhangka from '../../assets/trade/yinhangka.png'
import weixin from '../../assets/trade/weixin.png'
import yinhangka_icon from '../../assets/trade/yinhangka_icon.png'
import weixin_icon from '../../assets/trade/weixin_icon.png'
import zhifubao from '../../assets/trade/zhifubao.png'
import router from '@/router'

// Tabs
const activeTab = ref('buy') // 'buy' | 'sell'
const buyType = ref('select') // 'select' | 'quick'

// Popups
const showPayFilter = ref(false) // 支付方式
const showSellFilter = ref(false) // 售卖方式
const showAmountFilter = ref(false) // 金额
const showAllFilter = ref(false) // 全部筛选

// 箭头
const payArrow = computed(() => {
  return showPayFilter.value ? 'arrow-up' : 'arrow-down'
})
const sellArrow = computed(() => {
  return showSellFilter.value ? 'arrow-up' : 'arrow-down'
})
const amountArrow = computed(() => {
  return showAmountFilter.value ? 'arrow-up' : 'arrow-down'
})

// 拆分 不拆分
const isChaifen = ref(true)

// Filter selections
const selectedPay = ref('') // 支付方式
const selectedSell = ref('') // 售卖方式
const selectedAmount = ref('全部') // 金额

// Data
const amountOptions = ['全部', '10-100', '101-1000', '1001-5000', '5001-10000', '10001-20000']
const sellOptions = [
  { name: '全部', type: '' },
  { name: '拆分', type: '1' },
  { name: '不可拆分', type: '2' },
]
const payMethods = ref([
  { name: '全部', type: '', icon: '', reward: '0.2%' },
  { name: '银行卡', type: '3', icon: yinhangka, reward: '0.2%' },
  { name: '支付宝', type: '1', icon: zhifubao, reward: '0.1%' },
  { name: '微信', type: '2', icon: weixin, reward: '0.1%' },
  // { name: '数字人民币', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/scan.png', reward: '0.1%' },
])

const quickPayMethods = ref([
  // { name: '全部', type: '', icon: '', reward: '0.2%' },
  { name: '银行卡', type: '3', icon: yinhangka, reward: '0.2%' },
  { name: '支付宝', type: '1', icon: zhifubao, reward: '0.1%' },
  { name: '微信', type: '2', icon: weixin, reward: '0.1%' },
  // { name: '数字人民币', icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/scan.png', reward: '0.1%' },
])

const orders = ref([
  // { id: 1, title: '限制加微不买别点', rate: '40.16', time: '3分钟', split: true, min: 100, amount: 500.00 },
  // { id: 2, title: '支微加好友转谢谢', rate: '58.94', time: '3分钟', split: false, min: 100, amount: 1600.00 },
  // { id: 3, title: '别扫码加好友了', rate: '40.35', time: '1分钟', split: false, min: 100, amount: 2800.00 },
  // { id: 4, title: '一定要确定', rate: '40.16', time: '3分钟', split: false, min: 100, amount: 5000.00 },
])

/* 自选买币列表 */
const query = computed((): SellCoinsListAll => ({
  orderStatus: '1',
  payTypeSearch: selectedPay.value as SellCoinsListAll['payTypeSearch'],
  cfcf: selectedSell.value as SellCoinsListAll['cfcf'],
}))
getZixuan()
function getZixuan() {
  getSellCoinsListAll(query.value).then((res) => {
    if (res.code === ResCode.SUCCESS)
      orders.value = res?.data || []
  })
}

/* 自选买币 */
const isBuyShow = ref(false) // 购买弹框
const id = ref('') // 卖单id
const buyMoney = ref('') // 购买金额
function buyCoin() {
  const data = {
    money: buyMoney.value.trim(), // 金额
    orgOrderId: id.value, // 卖单id
    payType: selectedPay.value, // 支付方式 1支付宝、 2 微信 、3银行卡
  }
  buyCoins(data).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      // 购买成功逻辑
      showToast('购买成功')
      // 刷新页面
      getZixuan()
    }
  })
}

/* 快捷买币 */
// selectedMethodType 用于存储当前选中的支付方式的 `type`。
// 初始值为空字符串，表示默认没有选中任何项。
const selectedMethodType = ref('')
const quickBuyMony = ref('')
function quickBuy() {
  if (quickBuyMony.value.trim() === '') {
    showToast('请输入购买金额')
    return
  }
  if (Number(quickBuyMony.value.trim()) < 10) {
    showToast('限额最低10.00')
    return
  }
  if (selectedMethodType.value === '') {
    showToast('请选择付款方式')
    return
  }
  const data = {
    money: quickBuyMony.value.trim(), // 金额
    payType: selectedMethodType.value, // 付款类型
  }
  quickBuyCoins(data).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      // 购买成功逻辑
      showToast('购买成功')
      quickBuyMony.value = ''
      router.push({
      path: "/taborder",
      query: { data: '买币' }
    });
    }
  })
}

/* 卖币 */
const userInfo = ref() // 用户信息
const zdgm = ref('10') // 最低购买
// 收款方式
const sellGetMoneyMethods = ref([
  { payType: '1', payTypeName: '支付宝', icon: zhifubao, reward: null },
  { payType: '2', payTypeName: '微信', icon: weixin, reward: null },
  { payType: '3', payTypeName: '银行卡', icon: yinhangka, reward: null },
])
const placeholder = computed(() => {
  return `限额 10.00 ~ ${userInfo.value?.money || 0}`
})
watch(activeTab, (newVal) => {
  if (newVal === 'sell') {
    // 切换到卖币页面时的逻辑
    getCurUserInfo().then((res) => {
      if (res.code === ResCode.SUCCESS) {
        userInfo.value = res.data
      }
    })
    getPayType().then((res) => {
      if (res.code === ResCode.SUCCESS) {
        // sellGetMoneyMethods.value = res.data || []
      }
    })
  }
})

/* 卖币输入支付密码弹框 */
// 控制弹窗是否显示的响应式变量
const sellAmount = ref('') // 卖币数量
const showPaymentPopup = ref(false)
// --- 状态管理 ---
// 使用 Set 来存储当前选中的支付方式的 id。
const selectedMethods = ref(new Set<string>())
// 交易金额，在实际应用中这可能来自 props 或其他状态
// const transactionAmount = ref(100.00)
// 用于存储用户输入的支付密码
const password = ref('')
// 确认出售按钮
function confirmSell() {
  if (!sellAmount.value) {
    showToast('请输入卖币数量')
    return
  }
  if (Number(sellAmount.value) < Number(zdgm.value)) {
    showToast(`卖币数量不能小于最低购买${zdgm.value}`)
    return
  }
  if (Number(sellAmount.value) > (userInfo.value?.money || 0)) {
    showToast('卖币数量不能超过可售数量')
    return
  }
  if (selectedMethods.value.size === 0) {
    showToast('请选择收款方式')
    return
  }
  showPaymentPopup.value = true
}
// 过滤
/* function extractIds(arr) {
  return arr.map(item => item.id)
} */
// 确认出售提交
function handlePaymentSubmit() {
  // 1. 校验密码是否为空
  if (!password.value) {
    showToast('请输入支付密码')
    return
  }
  // 2. 执行业务逻辑（例如，调用 API）
  const sellData = {
    money: Number(sellAmount.value.trim()), // 金额
    zfmm: rsaEncrypt(password.value.trim()) as string, // 支付密码
    cfcf: isChaifen.value ? '1' : '2', // 是否拆分 1拆分 2不可拆分
    zdgm: Number(zdgm.value.trim()), // 最低购买量
    payTypeArray: Array.from(selectedMethods.value), // 支付方式 1支付宝、 2 微信 、3银行卡
    // payAccountIdsArray: extractIds(sellGetMoneyMethods.value),
  }
  sellCoins(sellData).then((res) => {
    if (res.code === ResCode.SUCCESS)
      showToast('出售成功')
  })

  // 3. 关闭弹窗
  showPaymentPopup.value = false

  // 4. (可选) 为安全起见，清空密码输入框
  password.value = ''
}

/* 卖币 收款方式按钮效果 */
// --- 数据定义 ---
// 使用 ref 创建响应式数据，存储支付方式列表。
// 每个对象包含 id, 名称, 图标URL, 和奖励信息。

// --- 方法 ---
/**
 * 切换单个支付方式的选中状态
 * @param methodId 被点击的支付方式的 id
 */
function toggleSelection(methodId: string) {
  // 检查 Set 中是否已存在该 id
  if (selectedMethods.value.has(methodId)) {
    // 如果已存在（即已被选中），则从 Set 中删除它，取消选中
    selectedMethods.value.delete(methodId)
  }
  else {
    // 如果不存在（即未被选中），则向 Set 中添加它，设为选中
    selectedMethods.value.add(methodId)
  }
}
function handleBuy(order) {
  console.log("object,",order);
  router.push({
    path: '/tabtrade/chooseBuyCoins',
    query: {
      order: JSON.stringify(order)
    }
  });
}
</script>

<template>
  <div class="bg-[#ECF1F7] min-h-screen">
    <!-- 顶部导航 -->
    <!-- <div class="text-white px-4 pb-3 pt-4 bg-[#0256FF] h-50px top-0 sticky z-10">
      <div class="flex items-center justify-between">
        <div class="text-xl flex gap-8 bottom-4px left-1/2 justify-center absolute -translate-x-1/2">
          <span
            class="pb-1" :class="[activeTab === 'buy' ? 'font-semibold text-24px' : '']"
            @click="activeTab = 'buy'"
          >买币</span>
          <span
            class="pb-1" :class="[activeTab === 'sell' ? 'font-semibold text-20px' : '']"
            @click="activeTab = 'sell'"
          >卖币</span>
        </div>
      </div>
    </div>-->
    <div class="text-white px-4 bg-[#0256FF] flex h-[50px] items-center top-0 sticky z-10">
      <div class="flex w-full items-center justify-center relative">
        <van-icon
          name="arrow-left"
          size="20"
          class="cursor-pointer left-0 absolute"
          @click="router.back()"
        />
        <div class="text-xl flex gap-8">
          <span
            class="pb-1 cursor-pointer"
            :class="{ 'font-semibold text-lg': activeTab === 'buy', 'opacity-75': activeTab !== 'buy' }"
            @click="activeTab = 'buy'"
          >买币</span>
          <span
            class="pb-1 cursor-pointer"
            :class="{ 'font-semibold text-lg': activeTab === 'sell', 'opacity-75': activeTab !== 'sell' }"
            @click="activeTab = 'sell'"
          >卖币</span>
        </div>
      </div>
    </div>
    <div :class="activeTab === 'sell' ? 'sell-style' : ''"></div>
    <!-- 内容区域 -->
    <div class="bg-[#0256FF]">
      <!-- 买币页面 -->
      <div v-if="activeTab === 'buy'">
        <div class="p-4 rounded-tl-8px rounded-tr-8px bg-[#ECF1F7]">
          <div class="mb-4 flex gap-2 items-center text-18px">
            <span
              :class="buyType === 'select' ? 'text-[#000]' : 'text-[#8A8A8D]'"
              @click="buyType = 'select'"
            >自选买币</span>
            <span class="text-gray-300">|</span>
            <span
              :class="buyType === 'quick' ? 'text-[#000]' : 'text-[#8A8A8D]'"
              @click="buyType = 'quick'"
            >快捷买币</span>
            <div v-show="false">
              <div
                v-if="buyType === 'select'"
                class="text-white px-3 rounded-full bg-[#FF8D1A]"
              >搬砖赚钱</div>
            </div>
          </div>
          <!-- 快捷买币 -->
          <div v-if="buyType === 'quick'">
            <div class="p-8px pb-12px pt-12px b-rounded-8px bg-white">
              <div class="text-gray-800 font-medium mb-3">买币金额</div>
              <van-field
                v-model="quickBuyMony"
                placeholder="限额最低10.00"
                class="mb-4 rounded-lg bg-[#ECF1F7]"
              />
              <div class="text-gray-800 font-medium mb-3">付款方式</div>
              <!-- <div class="mb-6 gap-3 grid grid-cols-4"> -->
              <!-- <div
                  v-for="item in payMethods" :key="item.name"
                  class="py-2 rounded-lg bg-[#E5E7EB] flex flex-col items-center justify-center"
                >
                  <div class="text-sm text-white font-bold px-2 py-0.5 rounded bg-gray-400">
                    未绑定
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    {{ item.name }}
                  </div>
              </div>-->
              <div class="mb-3 flex gap-4 items-center justify-center">
                <div
                  v-for="item in quickPayMethods"
                  :key="item.type"
                  class="pt-2 text-center border-2 rounded-lg bg-black/40 w-24 cursor-pointer transition-colors"
                  :class="selectedMethodType === item.type ? 'border-blue-500' : 'border-transparent'"
                  @click="selectedMethodType = item.type"
                >
                  <div class="mx-auto h-12 w-12 relative">
                    <van-image
                      :src="item.icon"
                      width="40"
                      height="40"
                      fit="contain"
                      class="h-full w-full"
                    />
                    <div class="rounded-md flex items-center inset-0 justify-center absolute">
                      <span class="text-16px text-white font-bold">未绑定</span>
                    </div>
                  </div>

                  <!-- 支付方式名称 -->
                  <div class="text-sm text-gray-800">{{ item.name }}</div>
                </div>
              </div>
              <!-- </div> -->
              <van-button block color="#0256FF" class="rounded-lg" @click="quickBuy">购买GUB币</van-button>
            </div>
          </div>

          <!-- 自选买币 -->
          <div v-else>
            <div class="text-12px text-sm text-[#8A8A8D] mb-4 flex gap-4 items-center">
              <span class="flex items-center" @click="showPayFilter = true">
                <span :class="[showPayFilter ? 'text-[#0256FF]' : '']">支付方式</span>
                <van-icon :color="showPayFilter ? '#0256FF' : ''" :name="payArrow" />
              </span>
              <span class="flex items-center" @click="showSellFilter = true">
                <span :class="[showSellFilter ? 'text-[#0256FF]' : '']">售卖方式</span>
                <van-icon :color="showSellFilter ? '#0256FF' : ''" :name="sellArrow" />
              </span>
              <span class="flex items-center" @click="showAmountFilter = true">
                <span :class="[showAmountFilter ? 'text-[#0256FF]' : '']">金额</span>
                <van-icon :color="showAmountFilter ? '#0256FF' : ''" :name="amountArrow" />
              </span>
              <span class="ml-auto flex items-center" @click="showAllFilter = true">
                筛选
                <van-icon name="filter-o" />
              </span>
            </div>
            <div v-for="order in orders" :key="order.id" class="bg-white flex order-style mb-14px">
              <div class="flex-1 w-37%">
                <div class="text-sm text-gray-800 font-medium flex h-50%">
                  <van-image
                    radius="8"
                    :src="order?.sellerHeader"
                    width="28px"
                    height="28px"
                    class="rounded-lg bg-gray-200"
                  />
                  <div
                    class="text-14px font-bold ml-6px w-70px inline-block"
                  >{{ order?.sellerNickName || '' }}</div>
                </div>
                <div
                  class="text-xs text-gray-400 mt-1"
                >交易成功率{{ order.rate }}% 平均回应时长{{ order.time }}</div>
              </div>
              <div class="pl-10px flex flex-col w-28%">
                <div class="h-50%">
                  <div
                    class="text-12px"
                    :class="[order.cfcfName === '可拆分' ? 'text-[#92BF60]' : 'text-[#B75B69]']"
                  >{{ order.cfcfName || '' }}</div>
                  <div class="text-10px text-gray-400">最低购买{{ order.zdgm || '' }}</div>
                </div>
                <div class="h-50%" style="margin-top:16px;">
                  <div
                    v-for="payType in (order.payTypeStr || '').split(',')"
                    :key="payType"
                    class="inline-block"
                  >
                    <van-image
                      v-if="payType === '微信'"
                      class="mr-2px"
                      :src="weixin_icon"
                      width="17"
                      height="17"
                      fit="contain"
                    />
                    <van-image
                      v-else-if="payType === '支付宝'"
                      class="mr-2px"
                      :src="zhifubao"
                      width="17"
                      height="17"
                      fit="contain"
                    />
                    <van-image
                      v-else-if="payType === '银行卡'"
                      class="mr-2px"
                      :src="yinhangka_icon"
                      width="17"
                      height="17"
                      fit="contain"
                    />
                    <!-- <van-icon v-if="payType === '微信'" name="chat-o" />
                    <van-icon v-else-if="payType === '支付宝'" name="refund-o" />
                    <van-icon v-else-if="payType === '银行卡'" name="vip-card-o" />-->
                  </div>
                </div>
              </div>
              <div class="text-16px pl-10px flex flex-col w-35% justify-between">
                <div class="text-lg font-bold text-center">
                  {{ order?.money || '' }}
                  <span class="text-10px text-[#8A8A8D]">GUB</span>
                </div>
                <van-button
                  color="#0256FF"
                  size="small"
                  class="h=32px mt-1 px-4 w-92px"
                  @click="handleBuy(order)"
                >购买</van-button>
              </div>
            </div>
            <van-empty v-if="orders.length === 0" image-size="80" description="暂无数据" />
          </div>
        </div>
      </div>

      <!-- 卖币页面 -->
      <div v-else>
        <div class="p-4 bg-[#ECF1F7]">
          <div style="height: 86px;"></div>
          <div
            class="p-20px pb-2px pt-30px rounded-8px bg-white"
            style="position: absolute;width:92%;top:76px  "
          >
            <div class="text-[#8A8A8D] font-bold mb-1 text-center">总余额</div>
            <div class="text-3xl mb-2 text-center">
              <span class="font-bold">{{ userInfo?.totalBalance || 0 }}</span>
              <span class="text-24px text-[#8A8A8D]">GUB</span>
            </div>
            <div class="text-16px text-[#8A8A8D] mb-4 mt-15px flex justify-between">
              <span>可售数量 {{ userInfo?.money || 0 }}</span>
              <span>
                不可售数量 {{ userInfo?.unavailableBalance || 0 }}
                <van-icon name="question-o" />
              </span>
            </div>
          </div>
          <div class="mt-10px p-10px rounded-8px bg-white">
            <div class="text-gray-800 font-medium mb-2">卖币数量</div>
            <van-field
              v-model="sellAmount"
              :placeholder="placeholder"
              class="mb-4 rounded-lg bg-[#F7F8FA]"
            >
              <template #button>
                <span>
                  GUB
                  <span class="text-[#0B7AFF]">全部</span>
                </span>
              </template>
            </van-field>
            <div class="text-gray-800 font-medium mb-2">是否拆分</div>
            <div class="mb-4 gap-3 grid grid-cols-2">
              <div
                class="line-height-35px text-align-center rounded-lg h-35px"
                :class="[isChaifen ? 'bg-[#ECF1F7]' : 'b-1 border-solid border-[#F1F3F2]']"
                @click="isChaifen = true"
              >可拆分</div>
              <!-- <van-button class="text-[#0B7AFF] border-0 bg-[#F0F8FF]">
                可拆分
              </van-button>-->
              <div
                class="line-height-35px text-align-center rounded-lg h-35px"
                :class="[!isChaifen ? 'bg-[#ECF1F7]' : 'b-1 border-solid border-[#F1F3F2]']"
                @click="isChaifen = false"
              >不拆分</div>
              <!-- <van-button class="text-gray-500 border-0 bg-[#F7F8FA]">
                不可拆分
              </van-button>-->
            </div>
            <template v-if="isChaifen">
              <div class="text-gray-800 font-medium mb-2">最低购买</div>
              <van-field v-model="zdgm" class="mb-4 rounded-lg bg-[#F7F8FA]" />
            </template>
            <div class="text-gray-800 font-medium mb-2">收款方式</div>
            <div class="mb-6 gap-3 grid grid-cols-3">
              <div
                v-for="item in sellGetMoneyMethods"
                :key="item.payType"
                class="py-1 text-center border-2 rounded-lg cursor-pointer transition-all relative"
                :class="selectedMethods.has(item.payType) ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-100'"
                @click="toggleSelection(item.payType)"
              >
                <!-- 奖励标签，使用 v-if 判断只有当 reward 存在时才渲染 -->
                <div
                  v-if="item.reward"
                  class="text-xs text-white px-2 py-0.5 rounded-full bg-red-500 whitespace-nowrap transform left-1/2 absolute -translate-x-1/2 -top-2.5"
                >🔥奖励{{ item.reward }}</div>

                <!--
          选中的对勾角标。
          - 使用 v-if 判断只有当该项被选中时才渲染。
          - 这是一个经典的 CSS 三角形技巧，通过设置不同方向的边框为透明或彩色来创建。
          - 内部的 van-icon 被绝对定位到三角形的合适位置上。
                -->
                <div
                  v-if="selectedMethods.has(item.payType)"
                  class="border-l-[24px] border-t-[24px] border-l-transparent border-t-blue-500 h-0 w-0 right-0 top-0 absolute"
                />
                <van-icon
                  v-if="selectedMethods.has(item.payType)"
                  name="success"
                  class="text-xs text-white right-0.5 top-0.5 absolute"
                />

                <!-- 支付方式图标 -->
                <img
                  :src="item.icon"
                  :alt="item.payTypeName"
                  class="mx-auto h-7 w-7 object-contain"
                />

                <!-- 支付方式名称 -->
                <div class="text-sm text-gray-800 mt-2">{{ item.payTypeName }}</div>
              </div>
            </div>
          </div>
          <div class="mt-10px">
            <van-button block color="#0256FF" class="rounded-lg" @click="confirmSell">确认出售</van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <!-- 买币-自选买币-金额 -->
    <van-popup v-model:show="showAmountFilter" position="bottom" round :style="{ padding: '20px' }">
      <div class="text-lg font-semibold mb-4 text-center">自选买币</div>
      <div class="text-gray-800 font-medium mb-2">金额</div>
      <div class="pb-4 gap-3 grid grid-cols-3">
        <div
          v-for="item in amountOptions"
          :key="item"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-16 cursor-pointer transition-colors items-center justify-center"
          :class="selectedAmount === item ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedAmount = item"
        >
          <div class="text-sm text-gray-700 font-medium">{{ item }}</div>
        </div>
      </div>
      <div class="pb-30px gap-3 grid grid-cols-2">
        <van-button color="#8A8A8D" @click="showAmountFilter = false; selectedAmount = '全部'">重置</van-button>
        <van-button color="#0256FF" type="primary" @click="showAmountFilter = false">确认</van-button>
      </div>
    </van-popup>

    <!-- 买币-自选买币-售卖方式 -->
    <van-popup v-model:show="showSellFilter" position="bottom" round :style="{ padding: '20px' }">
      <div class="text-lg font-semibold mb-4 text-center">自选买币</div>
      <div class="text-gray-800 font-medium mb-2">售卖方式</div>
      <div class="pb-5 flex gap-3 items-center">
        <div
          v-for="item in sellOptions"
          :key="item.type"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-15 w-20 cursor-pointer transition-colors items-center justify-center"
          :class="selectedSell === item.type ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedSell = item.type"
        >
          <div class="text-sm font-medium">{{ item.name }}</div>
        </div>
      </div>
      <div class="pb-30px gap-3 grid grid-cols-2">
        <van-button
          color="#8A8A8D"
          @click="showSellFilter = false; selectedSell = ''; getZixuan()"
        >重置</van-button>
        <van-button color="#0256FF" type="primary" @click="showSellFilter = false; getZixuan()">确认</van-button>
      </div>
    </van-popup>

    <!-- 买币-自选买币-支付方式 -->
    <van-popup v-model:show="showPayFilter" position="bottom" round :style="{ padding: '20px' }">
      <div class="text-lg font-semibold mb-4 text-center">自选买币</div>
      <div class="text-gray-800 font-medium mb-2">付款方式</div>

      <div class="pb-5 flex gap-3 items-center">
        <div
          v-for="item in payMethods"
          :key="item.type"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-15 w-22 cursor-pointer transition-colors items-center justify-center"
          :class="selectedPay === item.type ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedPay = item.type"
        >
          <!-- 使用 v-if/v-else 来区分处理“带图标的按钮”和“纯文本的‘全部’按钮”。 -->
          <template v-if="item.icon">
            <!-- 带图标的按钮 -->
            <van-image :src="item.icon" width="42" height="42" fit="contain" />
            <div class="text-10px text-[#8A8A8D] mt-1 bg-[#ECF1F7]">{{ item.name }}</div>
          </template>
          <template v-else>
            <!-- “全部”按钮 -->
            <div class="text-sm font-medium">{{ item.name }}</div>
          </template>
        </div>
      </div>
      <!-- <div class="mb-6 gap-3 grid grid-cols-4">
        <van-button
          v-for="item in payMethods" :key="item.type"
          :type="item.type === selectedPay ? 'primary' : 'default'" class="py-2 h-auto"
          @click="selectedPay = item.type"
        >
          <van-image v-if="!!item.icon" :src="item.icon" width="24" height="24" />
          <div class="text-xs mt-1">
            {{ item.name }}
          </div>
        </van-button>
      </div>-->
      <div class="pb-30px gap-3 grid grid-cols-2">
        <van-button color="#8A8A8D" @click="showPayFilter = false; selectedPay = ''; getZixuan()">重置</van-button>
        <van-button type="primary" color="#0256FF" @click="showPayFilter = false; getZixuan()">确认</van-button>
      </div>
    </van-popup>

    <!-- 买币-自选买币-筛选 -->
    <van-popup v-model:show="showAllFilter" position="bottom" round :style="{ padding: '20px' }">
      <div class="text-lg font-semibold mb-4 text-center">自选买币</div>
      <div class="text-gray-800 font-medium mb-2">付款方式</div>
      <!-- <div class="mb-4 gap-3 grid grid-cols-4">
        <van-button
          v-for="item in payMethods" :key="item.type"
          :type="item.type === selectedPay ? 'primary' : 'default'" class="py-2 h-auto"
          @click="selectedPay = item.type"
        >
          <van-image v-if="!!item.icon" :src="item.icon" width="24" height="24" />
          <div class="text-xs mt-1">
            {{ item.name }}
          </div>
        </van-button>
      </div>-->
      <div class="pb-5 flex gap-3 items-center">
        <div
          v-for="item in payMethods"
          :key="item.type"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-15 w-22 cursor-pointer transition-colors items-center justify-center"
          :class="selectedPay === item.type ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedPay = item.type"
        >
          <!-- 使用 v-if/v-else 来区分处理“带图标的按钮”和“纯文本的‘全部’按钮”。 -->
          <template v-if="item.icon">
            <!-- 带图标的按钮 -->
            <van-image :src="item.icon" width="42" height="42" fit="contain" />
            <div class="text-10px text-[#8A8A8D] mt-1 bg-[#ECF1F7]">{{ item.name }}</div>
          </template>
          <template v-else>
            <!-- “全部”按钮 -->
            <div class="text-sm font-medium">{{ item.name }}</div>
          </template>
        </div>
      </div>
      <div class="text-gray-800 font-medium mb-2">售卖方式</div>
      <!-- <div class="mb-4 gap-3 grid grid-cols-3">
        <van-button
          v-for="item in sellOptions" :key="item.type"
          :type="item.type === selectedSell ? 'primary' : 'default'" @click="selectedSell = item.type"
        >
          {{ item.name }}
        </van-button>
      </div>-->
      <div class="pb-5 flex gap-3 items-center">
        <div
          v-for="item in sellOptions"
          :key="item.type"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-15 w-20 cursor-pointer transition-colors items-center justify-center"
          :class="selectedSell === item.type ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedSell = item.type"
        >
          <div class="text-sm font-medium">{{ item.name }}</div>
        </div>
      </div>
      <div class="text-gray-800 font-medium mb-2">金额</div>
      <!-- <div class="mb-6 gap-3 grid grid-cols-3">
        <van-button
          v-for="item in amountOptions" :key="item" :type="item === selectedAmount ? 'primary' : 'default'"
          @click="selectedAmount = item"
        >
          {{ item }}
        </van-button>
      </div>-->
      <div class="pb-4 gap-3 grid grid-cols-3">
        <div
          v-for="item in amountOptions"
          :key="item"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-16 cursor-pointer transition-colors items-center justify-center"
          :class="selectedAmount === item ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="selectedAmount = item"
        >
          <div class="text-sm text-gray-700 font-medium">{{ item }}</div>
        </div>
      </div>
      <div class="pb-30px gap-3 grid grid-cols-2">
        <van-button
          color="#8A8A8D"
          @click="showAllFilter = false; selectedPay = ''; selectedSell = ''; getZixuan()"
        >重置</van-button>
        <van-button color="#0256FF" type="primary" @click="showAllFilter = false; getZixuan()">确认</van-button>
      </div>
    </van-popup>

    <!-- 自选买币 购买 弹框 -->
    <!-- <van-popup
      v-model:show="isBuyShow"
      closeable
      round
      :style="{ padding: '20px', width: '90%' }"
      @closed="buyMoney = ''"
    >
      <div class="text-center">
        <h3 class="font-bold mb-4">购买金额</h3>
        <van-field v-model="buyMoney" placeholder="请输入购买金额" class="mb-4 rounded-lg bg-[#ECF1F7]" />
        <van-button
          type="primary"
          color="#0256FF"
          block
          class="mt-4"
          @click="buyCoin(); isBuyShow = false; buyMoney = ''"
        >提交</van-button>
      </div>
    </van-popup>-->

    <!-- 卖币输入支付密码弹框 -->
    <van-popup
      v-model:show="showPaymentPopup"
      round
      position="center"
      teleport="body"
      :style="{ width: '85%' }"
    >
      <div class="font-sans p-6">
        <!-- 1. 弹窗头部 -->
        <div class="mb-4 text-center relative">
          <h3 class="text-lg font-semibold">请输入支付密码</h3>
          <van-icon
            name="cross"
            class="cursor-pointer right-0 top-1/2 absolute -translate-y-1/2"
            size="30"
            @click="showPaymentPopup = false"
          />
        </div>
        <!-- 2. 交易金额 -->
        <div class="mb-4 text-center">
          <span class="text-3xl font-bold">{{ sellAmount || 0 }}</span>
          <span class="text-gray-500 ml-1">GUB</span>
        </div>
        <van-divider />
        <!-- 3. 费用明细 -->
        <div class="text-sm my-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">服务费(2%)</span>
            <span class="font-mono">0.00 GUB</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">服务费减免</span>
            <span class="font-mono">-0.00 GUB</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-gray-600 flex items-center">
              <span>服务费减免额度</span>
              <van-icon name="question-o" class="ml-1" />
            </div>
            <span class="font-mono">0.00 GUB</span>
          </div>
        </div>
        <van-divider />
        <!-- 4. 支付密码输入 -->
        <div class="my-4">
          <p class="font-semibold mb-2">支付密码</p>
          <van-field v-model="password" placeholder="请输入支付密码" class="!rounded-lg !bg-[#ecf1f7]" />
        </div>
        <!-- 5. 提交按钮 -->
        <div class="mt-6">
          <van-button type="primary" color="#0256FF" block @click="handlePaymentSubmit">提交</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
:deep(.van-cell) {
  background: #ecf1f7;
}
.order-style {
  border-radius: 8px;
  padding: 14px 24px;
}
.sell-style {
  height: 80px;
  width: 100%;
  background: #0256ff;
}
:deep(.van-field__control) {
  font-size: 16px !important;
}
</style>

<!-- <route lang="json5">
{
  name: 'Trade'
}
</route> -->
