<script setup lang="ts">
import router from '@/router'
import wechat from '@/assets/my_new/weixin.png'
import bgWechat from '@/assets/my_new/bg_weixin.png'
import { delPayMethod, getPayMethodListByType, setDefaultPayMethod } from '@/api/paymethod'
import { ResCode } from '@/utils/const'

/* -------------------------------------------------------------------------- */
/*                               本地图片配置区域                              */
/* -------------------------------------------------------------------------- */
const images = {
  // 微信小图标
  icon: wechat,
  // 微信背景水印 (半透明大图)
  bgDecor: bgWechat,
}

/* -------------------------------------------------------------------------- */
/*                                  逻辑数据                                   */
/* -------------------------------------------------------------------------- */
const list = ref([])
const wechatList = ref([
  /*  {
    id: '1',
    name: '张王李',
    account: '15505888888',
    addTime: '2025-11-06 15:12:50',
    isDefault: true,
    isSelected: false,
    status: 'auditing', // auditing: 审核中, normal: 正常
  }, */
])
init()
function init() {
  getPayMethodListByType('2').then((res) => {
    if (res.code === ResCode.SUCCESS) {
      list.value = res?.data || []
    }
    wechatList.value = list.value.map((item) => {
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

// 设置默认卡
function onSetDefault(item) {
  if (item.isDefault === '1')
    return
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
  if (wechatList.value.length >= 5) {
    showToast('最多添加5个')
    return
  }
  router.push('/reciptpaymethod_new/wechat/add')
}

// 删除逻辑联动
function onDelete() {
  const selectedItems = wechatList.value.filter(item => item.isSelected)
  if (selectedItems.length === 0) {
    showToast('请选择')
    return
  }

  // 执行删除操作
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
        <span class="text-lg text-white font-medium">微信列表</span>
      </template>
    </van-nav-bar>

    <!-- 2. 可滚动列表区域 -->
    <div class="p-4 flex-1 overflow-y-auto">
      <div class="space-y-3">
        <div
          v-for="item in wechatList" :key="item.id"
          class="text-white p-4 rounded-lg bg-[#006400] shadow-sm transition-all relative overflow-hidden active:scale-98"
          @click="onToggleSelect(item)"
        >
          <!-- 选中状态 (右上角) -->
          <div class="right-3 top-3 absolute z-20" @click.stop="onToggleSelect(item)">
            <div
              class="border border-white/80 rounded-full flex h-5 w-5 transition-colors items-center justify-center"
              :class="item.isSelected ? 'bg-white' : 'bg-transparent'"
            >
              <van-icon v-if="item.isSelected" name="success" color="#006400" size="12" />
            </div>
          </div>

          <!-- 卡片内容 -->
          <div class="flex gap-3 items-start items-center relative z-10">
            <!-- 图标 -->
            <div class="rounded-lg bg-white/20 flex flex-shrink-0 items-center justify-center backdrop-blur-sm">
              <img :src="images.icon" class="h-[80px] w-[80px] object-contain" alt="icon">
            </div>

            <!-- 信息 -->
            <div class="text-sm flex flex-col">
              <div class="text-base font-medium">
                姓名: {{ item?.name || '' }}
              </div>
              <div class="font-mono mt-1 opacity-90">
                账号: {{ item?.wxAccount || '' }}
              </div>
              <div class="text-xs mt-1 opacity-70">
                添加时间:{{ item?.createTime || '' }}
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
        <span class="text-sm text-gray-700 font-medium">添加收付款方式</span>
      </div>
      <div class="text-xs text-gray-400 mb-4">
        温馨提示:最多只能添加5个微信收款码
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
