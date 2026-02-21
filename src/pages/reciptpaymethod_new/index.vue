<script setup lang="ts">
import router from '@/router'
import { getPayMethodList } from '@/api/paymethod'

import alipay from '@/assets/my_new/alipay.png'
import wechat from '@/assets/my_new/weixin.png'
import bank from '@/assets/my_new/bank.png'
import bgAlipay from '@/assets/my_new/bg_alipay.png'
import bgWechat from '@/assets/my_new/bg_weixin.png'
import bgbank from '@/assets/my_new/bg_bank.png'
import avatarAlipay from '@/assets/trade/zhifubao.png'
import avatarWechat from '@/assets/trade/weixin.png'
import avatarBank from '@/assets/trade/yinhangka.png'
import { ResCode } from '@/utils/const'

const images = {
  // 列表/弹窗中使用的小图标
  alipay, // 支付宝小图标
  wechat, // 微信小图标
  bank, // 银行卡小图标
  // cny: '/path/to/icon_cny.png', // 数字人民币小图标
  // usdt: '/path/to/icon_usdt.png', // USDT小图标
  // 卡片背景装饰大图标（半透明水印）
  bgAlipay, // 支付宝背景大图
  bgWechat, // 微信背景大图
  bgbank, // 银联背景大图

  avatarAlipay,
  avatarWechat,
  avatarBank,
}

/* -------------------------------------------------------------------------- */
/*                                  逻辑代码                                   */
/* -------------------------------------------------------------------------- */

const showAddPopup = ref(false)

// 模拟已添加的收款方式数据（对应图2）
// 【注意】：将此数组清空（[]）即可看到“暂无数据”的空状态（对应图1）
const myPaymentList = ref([
  /* {
    id: 1,
    type: 'alipay',
    name: '支付宝',
    accountName: '张王李',
    accountNo: '15505888888',
    statusText: '已禁用 (1)',
    bgColor: 'bg-[#1296DB]', // 支付宝蓝
    icon: images.alipay,
    bgDecor: images.bgAlipay,
  },
  {
    id: 2,
    type: 'bank',
    name: '农业银行',
    accountName: '张王李',
    accountNo: '6230888888888888888',
    statusText: '已绑定(1)',
    bgColor: 'bg-[#0256FF]', // 银行蓝
    icon: images.bank,
    bgDecor: images.bgbank,
  },
  {
    id: 3,
    type: 'wechat',
    name: '微信',
    accountName: '张王李',
    accountNo: '15505888888',
    statusText: '已绑定(1)',
    bgColor: 'bg-[#04AD0F]', // 微信绿
    icon: images.wechat,
    bgDecor: images.bgWechat,
  }, */
])

// 弹窗中可选的添加类型（对应图3）
const availableOptions = [
  { name: '银行卡', type: 'bank', icon: images.avatarBank, status: '未绑定', statusColor: 'text-red-500' },
  { name: '支付宝', type: 'alipay', icon: images.avatarAlipay, status: '未绑定', statusColor: 'text-red-500' },
  { name: '微信', type: 'wechat', icon: images.avatarWechat, status: '未绑定', statusColor: 'text-red-500' },
  // { name: '数字人民币', icon: images.cny, status: '未绑定', statusColor: 'text-red-500' },
  // { name: 'USDT', icon: images.usdt, status: '未绑定', statusColor: 'text-red-500' },
]

// 支付方式列表
const payList = ref([])
const PAYMENT_CONFIG = {
  1: { icon: images.alipay, bgColor: 'bg-[#1296DB]', bgDecor: images.bgAlipay },
  2: { icon: images.wechat, bgColor: 'bg-[#04AD0F]', bgDecor: images.bgWechat },
  3: { icon: images.bank, bgColor: 'bg-[#0256FF]', bgDecor: images.bgbank },
}
init()
function init() {
  getPayMethodList().then((res) => {
    if (res.code === ResCode.SUCCESS) {
      payList.value = res?.data || []
    }
    myPaymentList.value = payList.value.map((item) => {
      return ({
        ...item,
        bgColor: PAYMENT_CONFIG[item.payType]?.bgColor,
        icon: PAYMENT_CONFIG[item.payType]?.icon,
        bgDecor: PAYMENT_CONFIG[item.payType]?.bgDecor,
      })
    })
  })
}

// 添加收付款方式
function addPay(type: string) {
  if (type === 'alipay') {
    router.push('/reciptpaymethod_new/alipay/add')
  }
  else if (type === 'bank') {
    router.push('/reciptpaymethod_new/bank/add')
  }
  else if (type === 'wechat') {
    router.push('/reciptpaymethod_new/wechat/add')
  }
  showAddPopup.value = false
}

// 跳转到页面
function jumpToList(type: string) {
  if (type === '3') {
    router.push('/reciptpaymethod_new/bank')
  }
  else if (type === '1') {
    router.push('/reciptpaymethod_new/alipay')
  }
  else if (type === '2') {
    router.push('/reciptpaymethod_new/wechat')
  }
}
</script>

<template>
  <!--
  1. 外层容器修改：
  - 改为 `h-screen` (固定高度为屏幕高度)
  - 添加 `overflow-hidden` (防止整体出现滚动条)
-->
  <div class="font-sans bg-gray-50 flex flex-col h-screen overflow-hidden">
    <!--
    2. 顶部导航栏修改：
    - 添加 `flex-shrink-0` (防止被挤压)
    - `z-10` 确保阴影等层级正确
  -->
    <van-nav-bar :border="false" class="custom-nav-bar flex-shrink-0 z-10" @click-left="router.back()">
      <template #left>
        <van-icon name="arrow-left" size="22" color="white" />
      </template>
      <template #title>
        <span class="text-lg text-white font-medium">收付款方式</span>
      </template>
    </van-nav-bar>

    <!--
    3. 主内容区域修改：
    - 添加 `overflow-y-auto` (内容溢出时垂直滚动)
    - `flex-1` 确保占满导航栏下方的所有剩余空间
  -->
    <div class="p-4 flex-1 overflow-y-auto">
      <!-- 添加按钮 -->
      <div
        class="mb-6 py-4 border-2 border-gray-300 rounded-lg border-dashed bg-white flex cursor-pointer items-center justify-center active:bg-gray-100"
        @click="showAddPopup = true"
      >
        <van-icon name="plus" class="text-blue-600 font-bold mr-2" />
        <span class="text-sm text-gray-700 font-medium">添加收付款方式</span>
      </div>

      <!-- 列表内容 -->
      <template v-if="myPaymentList.length > 0">
        <div class="space-y-3">
          <div
            v-for="item in myPaymentList" :key="item.id"
            class="text-white p-3 rounded-xl shadow-sm transition-transform relative overflow-hidden active:scale-98  mb-8px"
            :class="item.bgColor"
          >
            <!-- 卡片内容层 (z-index 保证在背景图之上) -->
            <div class="flex justify-between relative z-10" @click="jumpToList(item.payType)">
              <div class="flex gap-3">
                <!-- 左侧图标容器 -->
                <div class="flex items-center justify-center backdrop-blur-md">
                  <img :src="item.icon" class="h-[70px] w-[70px] object-contain" alt="icon">
                </div>
                <!-- 中间信息 -->
                <div class="flex flex-col">
                  <span v-if="item.payType === '3'" class="text-base font-medium">{{ item?.bankName || '' }}</span>
                  <span v-else class="text-base font-medium">{{ item?.payTypeName || '' }}</span>
                  <!-- 账户名 -->
                  <span class="text-sm mt-0.5 opacity-90">{{ item?.name || '' }}</span>
                  <!-- 账户号 -->
                  <span v-if="item.payType === '1'" class="text-sm tracking-wide font-mono mt-2 opacity-95">{{
                    item?.zfbAccount || '' }}</span>
                  <span v-else-if="item.payType === '2'" class="text-sm tracking-wide font-mono mt-2 opacity-95">{{
                    item?.wxAccount || '' }}</span>
                  <span v-else-if="item.payType === '3'" class="text-sm tracking-wide font-mono mt-2 opacity-95">{{
                    item?.bankCardNumber || '' }}</span>
                </div>
              </div>
              <!-- 右上角状态 -->
              <!-- 账号数量 -->
              <div class="text-xs font-medium opacity-80">
                {{ item?.accountNum || '' }}
              </div>
            </div>

            <!-- 背景装饰水印 (绝对定位，旋转，半透明) -->
            <img
              :src="item.bgDecor"
              class="opacity-20 h-28 w-28 pointer-events-none rotate-[-15deg] absolute object-contain -bottom-5 -right-4"
              alt="bg-decor"
            >
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <template v-else>
        <div class="mt-20 flex flex-col items-center justify-center">
          <van-empty description="暂无数据" image-size="100" />
        </div>
      </template>
    </div>

    <!-- 3. 底部弹窗：添加收付款方式 -->
    <van-popup v-model:show="showAddPopup" position="bottom" round safe-area-inset-bottom class="max-h-[70%]">
      <div class="flex flex-col">
        <div class="text-lg text-gray-800 font-bold py-4 text-center border-b border-gray-100">
          添加收付款方式
        </div>
        <div class="px-4 pb-6 pt-2">
          <div
            v-for="(option, index) in availableOptions" :key="index"
            class="py-4 border-b border-gray-50 flex cursor-pointer items-center justify-between last:border-none active:bg-gray-50"
            @click="addPay(option.type)"
          >
            <div class="flex gap-3 items-center">
              <img :src="option.icon" class="h-6 w-6 object-contain" alt="opt-icon">
              <span class="text-sm text-gray-700 font-medium">{{ option.name }}</span>
            </div>
            <span class="text-xs font-medium" :class="option.statusColor">{{ option.status }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
/* 强制覆盖 Vant NavBar 背景色为蓝色 */
.custom-nav-bar {
  background-color: #0256ff !important;
}

/* 消除 NavBar 下边框 */
:deep(.van-nav-bar__content) {
  border: none;
}
</style>
