<script setup lang="ts">
import bank from '@/assets/my_new/bank.png'
import bgbank from '@/assets/my_new/bg_bank.png'

import router from '@/router'
import { delPayMethod, getPayMethodListByType, setDefaultPayMethod } from '@/api/paymethod'
import { ResCode } from '@/utils/const'

/* -------------------------------------------------------------------------- */
/*                               本地图片配置区域                              */
/* -------------------------------------------------------------------------- */
const images = {
  // 银行卡小图标 (如白色线性图标)
  icon: bank,
  // 银联背景水印 (半透明大图)
  bgDecor: bgbank,
}

/* -------------------------------------------------------------------------- */
/*                                  逻辑数据                                   */
/* -------------------------------------------------------------------------- */

// interface BankCard {
//   id: string
//   name: string
//   cardNo: string
//   bankName: string
//   addTime: string
//   isDefault: boolean
//   isSelected: boolean // 新增：选中状态字段
// }
const list = ref([])
const bankList = ref([
  /* {
    id: '1',
    name: '张王李',
    cardNo: '6230521970008916976',
    bankName: '农业银行',
    addTime: '2025-11-06 15:12:50',
    isDefault: true,
    isSelected: false,
  },
  {
    id: '2',
    name: '张王李',
    cardNo: '6230521970008916976',
    bankName: '中信银行',
    addTime: '2025-11-06 15:12:50',
    isDefault: false,
    isSelected: false,
  }, */
])
init()
function init() {
  getPayMethodListByType('3').then((res) => {
    if (res.code === ResCode.SUCCESS) {
      list.value = res?.data || []
    }
    bankList.value = list.value.map((item) => {
      return {
        ...item,
        isSelected: false,
      }
    })
  })
}

const onClickLeft = () => router.back()

// 切换选中状态
function onToggleSelect(item) {
  item.isSelected = !item.isSelected
}

// 设置为默认卡
function onSetDefault(item) {
  if (item.isDefault === '1')
    return // 已经是默认卡，不做操作

  /* alipayList.value.forEach((acc) => {
    acc.isDefault = (acc.id === item.id)
  }) */
  setDefaultPayMethod(item.id).then((res) => {
    if (res.code === ResCode.SUCCESS)
      showToast('已设置为默认')
    init()
  })
}

function onAdd() {
  if (bankList.value.length >= 5) {
    showToast('最多添加5个')
    return
  }
  router.push('/reciptpaymethod_new/bank/add')
}

// 删除逻辑联动
function onDelete() {
  const selectedItems = bankList.value.filter(item => item.isSelected)
  if (selectedItems.length === 0) {
    showToast('请选择')
    return
  }

  // 执行删除操作
  // alipayList.value = alipayList.value.filter(item => !item.isSelected)
  const delList = selectedItems.map((item) => {
    return item.id
  })
  delPayMethod(delList).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      showToast(`删除成功`)
      init()
    }
  })
}
</script>

<template>
  <div class="font-sans bg-gray-50 flex flex-col h-screen overflow-hidden">
    <!-- 1. 固定头部 -->
    <van-nav-bar :border="false" class="custom-nav-bar flex-shrink-0 z-10" @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" size="22" color="white" />
      </template>
      <template #title>
        <span class="text-lg text-white font-medium">银行卡列表</span>
      </template>
    </van-nav-bar>

    <!-- 2. 可滚动列表区域 -->
    <div class="p-4 flex-1 overflow-y-auto">
      <div class="space-y-3">
        <div
          v-for="item in bankList" :key="item.id"
          class="text-white p-2 rounded-lg bg-[#0052D9]  mb-10px shadow-sm transition-all relative overflow-hidden active:scale-98"
          @click="onToggleSelect(item)"
        >
          <!-- 选中状态 (右上角) -->
          <div class="right-3 top-3 absolute z-20" @click.stop="onToggleSelect(item)">
            <div
              class="border border-white/80 rounded-full flex h-5 w-5 transition-colors items-center justify-center"
              :class="item.isSelected ? 'bg-white' : 'bg-transparent'"
            >
              <van-icon v-if="item.isSelected" name="success" color="#0052D9" size="12" />
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="flex gap-3 items-start items-center relative z-10">
            <!-- 图标 -->
            <div class="rounded-lg bg-white/20 flex flex-shrink-0 items-center justify-center backdrop-blur-sm">
              <img :src="images.icon" class="h-[67px] w-[67px] object-contain" alt="icon">
            </div>

            <!-- 信息 -->
            <div class="text-sm flex flex-col">
              <div class="text-14px font-medium">
                姓名:{{ item?.name || '' }}
              </div>
              <div class="font-mono opacity-90">
                卡号:{{ item?.bankCardNumber || '' }}
              </div>
              <div class=" opacity-90">
                银行名称:{{ item.bankName || '' }}
              </div>
              <div class="text-xs opacity-70">
                添加时间:{{ item.createTime || '' }}
              </div>

              <!-- 底部状态栏 -->
              <div class="mt-2 flex gap-2 items-center">
                <!-- 默认卡切换 -->
                <div class="flex gap-1 items-center" @click.stop="onSetDefault(item)">
                  <van-icon
                    :name="item.isDefault === '1' ? 'checked' : 'circle'"
                    :color="item.isDefault === '1' ? '#ffffff' : 'rgba(255,255,255,0.6)'" size="16"
                  />
                  <span
                    class="text-xs font-medium"
                    :class="item.isDefault === '1' ? 'text-white' : 'text-white/60'"
                  >默认卡</span>
                </div>

                <!-- 审核中状态 -->
                <div
                  v-if="item.authStatusName === '审核中'"
                  class="text-xs text-white px-1 py-0.5 rounded bg-black/20 flex gap-1 items-center"
                >
                  <span class="font-medium">审核中</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 背景水印 -->
          <img
            :src="images.bgDecor"
            class="opacity-20 h-24 w-24 pointer-events-none rotate-[-15deg] absolute object-contain -bottom-4 -right-2"
            alt="bg"
          >
        </div>
      </div>
    </div>

    <!-- 3. 固定底部操作区 -->
    <div class="px-4 pb-6 pt-2 bg-gray-50 flex-shrink-0">
      <div
        class="mb-2 py-3.5 border-2 border-gray-300 rounded-lg border-dashed bg-white flex cursor-pointer items-center justify-center active:bg-gray-100"
        @click="onAdd"
      >
        <van-icon name="plus" class="text-blue-600 font-bold mr-1" />
        <span class="text-sm text-gray-700 font-medium">添加银行卡</span>
      </div>
      <div class="text-xs text-gray-400 mb-4">
        温馨提示:最多只能添加5个银行卡
      </div>
      <button
        class="text-base text-white font-medium py-3 rounded-lg bg-gray-500 w-full transition-colors active:bg-gray-600"
        @click="onDelete"
      >
        删除
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-nav-bar {
  background-color: #0256ff !important;
}

:deep(.van-nav-bar__content) {
  border: none;
}
</style>
