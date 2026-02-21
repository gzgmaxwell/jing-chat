<script setup lang="ts">
import router from '@/router'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import yinhangka from '../../assets/trade/yinhangka.png'
import weixin from '../../assets/trade/weixin.png'
import yinhangka_icon from '../../assets/trade/yinhangka_icon.png'
import weixin_icon from '../../assets/trade/weixin_icon.png'
import zhifubao from '../../assets/trade/zhifubao.png'
import { ResCode } from '@/utils/const'
import { buyCoins } from '@/api/sellbuycoin'

const route = useRoute()
const order = route.query.order ? JSON.parse(route.query.order) : null
console.log('orderorder', order)
const isLogoutShow = ref(false)
const onClickLeft = () => router.back()
const selectedMethods = ref<string | null>(null)
const buyAmount = ref('') // 卖币数量
interface PayMethod {
  id: string
  name: string
  icon: string
}

const selectedPayMethod = ref<string>('bank')

// 收款方式
const sellGetMoneyMethods = ref([
  { payType: '1', payTypeName: '支付宝', icon: zhifubao, reward: null },
  { payType: '2', payTypeName: '微信', icon: weixin, reward: null },
  { payType: '3', payTypeName: '银行卡', icon: yinhangka, reward: null },
])
const payTypeNamesInObject = order.payTypeStr.split(',')

// 过滤 sellGetMoneyMethods，只保留 payTypeName 存在于 payTypeStr 的
sellGetMoneyMethods.value = sellGetMoneyMethods.value.filter(item =>
  payTypeNamesInObject.includes(item.payTypeName),
)

function toggleSelection(methodId: string) {
  // 检查 Set 中是否已存在该 id
  if (selectedMethods.value === methodId) {
    // 点击已选中项，取消选择
    selectedMethods.value = null
  }
  else {
    // 选择当前项
    selectedMethods.value = methodId
  }
}
function buyCoin() {
  console.log(
    'selectedMethods',
    selectedMethods.value,
    buyAmount.value,
    order.buys[0].orgOrderId,
  )
  const data = {
    money: buyAmount.value.trim(), // 金额
    orgOrderId: order.buys[0].orgOrderId, // 卖单id
    payType: selectedMethods.value, // 支付方式 1支付宝、 2 微信 、3银行卡
  }
  buyCoins(data).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      // 购买成功逻辑
      showToast('购买成功')
      router.push({
        path: '/taborder',
        query: { data: '买币' },
      })
    }
  })
}
function allBtn() {
  buyAmount.value = order.money
}
</script>

<template>
  <div class="font-sans bg-[#ECF1F7] flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg font-bold">自选买币</span>
      </template>
    </van-nav-bar>
    <div class="page">
      <!-- 顶部用户信息 -->
      <div class="user-info">
        <img class="avatar" :src="order.sellerHeader" alt="avatar">
        <div class="user-text">
          <div class="user-id">
            {{ order.sellerNickName }}
          </div>
          <div class="user-balance">
            <span class="balance-amount">{{ order.money.toFixed(2) }}</span>
            <span class="balance-unit">GUB</span>
          </div>
        </div>
      </div>
      <div class="p-10px rounded-8px bg-white">
        <div class="text-gray-800 font-medium mb-2">
          买币金额
        </div>
        <van-field v-model="buyAmount" placeholder="请输入买币金额" class="mb-6 rounded-lg bg-[#F7F8FA]">
          <template #button>
            <span>
              GUB
              <span class="text-[#0B7AFF]" @click="allBtn">全部</span>
            </span>
          </template>
        </van-field>
        <!-- 收款方式 -->
        <div class="text-gray-800 font-medium mb-6">
          收款方式
        </div>
        <div class="mb-6 gap-3 grid grid-cols-3">
          <div
            v-for="item in sellGetMoneyMethods"
            :key="item.payType"
            class="py-1 text-center border-2 rounded-lg cursor-pointer transition-all relative"
            :class="selectedMethods === item.payType ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-100'"
            @click="toggleSelection(item.payType)"
          >
            <!-- 奖励标签，使用 v-if 判断只有当 reward 存在时才渲染 -->
            <div
              v-if="item.reward"
              class="text-xs text-white px-2 py-0.5 rounded-full bg-red-500 whitespace-nowrap transform left-1/2 absolute -translate-x-1/2 -top-2.5"
            >
              🔥奖励{{ item.reward }}
            </div>

            <!--
          选中的对勾角标。
          - 使用 v-if 判断只有当该项被选中时才渲染。
          - 这是一个经典的 CSS 三角形技巧，通过设置不同方向的边框为透明或彩色来创建。
          - 内部的 van-icon 被绝对定位到三角形的合适位置上。
            -->
            <div
              v-if="selectedMethods === item.payType"
              class="border-l-[24px] border-t-[24px] border-l-transparent border-t-blue-500 h-0 w-0 right-0 top-0 absolute"
            />
            <van-icon
              v-if="selectedMethods === item.payType"
              name="success"
              class="text-xs text-white right-0.5 top-0.5 absolute"
            />

            <!-- 支付方式图标 -->
            <img :src="item.icon" :alt="item.payTypeName" class="mx-auto h-7 w-7 object-contain">

            <!-- 支付方式名称 -->
            <div class="text-sm text-gray-800 mt-2">
              {{ item.payTypeName }}
            </div>
          </div>
        </div>
        <div class="mb-2">
          <van-button
            block
            color="#0256FF"
            class="rounded-lg"
            @click="buyCoin(); buyAmount = ''"
          >
            购买FCB币
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background: #0256ff;
}
:deep(.van-nav-bar__title) {
  color: #fff;
}
:deep(.van-cell) {
  background: #ecf1f7;
}
.page {
  padding: 16px;
}

/* 顶部用户信息 */
.user-info {
  display: flex;
  align-items: center;
  padding: 13px;
  border-radius: 8px;
  padding-top: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
}

.user-text {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-id {
  font-weight: 500;
  font-size: 14px;
  color: #222;
}

.user-balance {
  font-weight: 700;
  font-size: 18px;
  color: #222;
  display: flex;
  align-items: center;
}

.balance-unit {
  font-weight: 400;
  font-size: 12px;
  color: #8a8a8d;
  margin-left: 4px;
}

/* 输入框调整，van-field 默认padding 右侧留白 suffx */
.van-field__control {
  padding-right: 80px !important;
}

.all-text {
  color: #0256ff;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

/* 收款方式 */
.label {
  font-size: 14px;
  font-weight: 500;
  color: #222;
  margin: 24px 0 10px;
}

.pay-methods {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.pay-method {
  flex: 1;
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 0;
  text-align: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  border: 1.5px solid transparent;
  transition: border-color 0.3s ease;
}

.pay-method.active {
  border-color: #0256ff;
}

.pay-method img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  margin-bottom: 6px;
}

.pay-name {
  font-size: 13px;
  color: #222;
}

/* 右上角蓝色小角标 */
.checkmark {
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
  background: #0256ff;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* 购买按钮 */
.buy-btn {
  border-radius: 8px;
  height: 44px;
  font-weight: 700;
  font-size: 16px;
}
</style>
