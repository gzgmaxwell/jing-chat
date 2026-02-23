<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import { getCurUserInfo } from '@/api/user'
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'
import banner from '@/assets/banner.png'
import iconDynamic from '@/assets/icons/my_svg/dynamic.svg'
import iconCollect from '@/assets/icons/my_svg/collect.svg'
import iconAuth from '@/assets/icons/my_svg/auth.svg'
import iconService from '@/assets/icons/my_svg/service.svg'
import iconAbout from '@/assets/icons/my_svg/about.svg'
import iconExchange from '@/assets/tabbar_new/my/tranicon.png'

const userStore = useUserStore()
const cachedUserInfo = JSON.parse(localStorage.getItem('userInfo'))
if (cachedUserInfo)
  userStore.userInfo = cachedUserInfo
const userInfo = computed(() => userStore.userInfo)

getCurUserInfo().then((res) => {
  userStore.userInfo = res.data
  userStore.getUserInfo()
})

const { copy, isSupported } = useClipboard()
async function copyId() {
  if (!isSupported) {
    showToast('当前环境不支持复制')
    return
  }
  await copy(userInfo.value?.userId || '')
  showToast('已复制')
}

function goNodata(type: 'dynamic' | 'collect') {
  router.push({ path: '/nodata', query: { url: type } })
}

function goExchange() {
  showToast('敬请期待')
}
</script>

<template>
  <div class="my-container">
    <div class="bgimg text-white px-4 pb-4 pt-5 relative">
      <div class="flex items-start justify-between">
        <div class="flex items-center">
          <div class="rounded-8px bg-white/20 h-48px w-48px overflow-hidden">
            <img :src="userInfo?.header" class="h-full w-full object-cover">
          </div>
          <div class="ml-12px">
            <div class="text-16px font-700">
              {{ userInfo?.nickName || (`JM-${userInfo?.userId || ''}`) }}
            </div>
            <div class="text-12px mt-6px opacity-90 flex items-center">
              <span>ID: {{ userInfo?.userId || '' }}</span>
              <i class="i-carbon-copy ml-6px" @click.stop="copyId" />
            </div>
          </div>
        </div>
        <div class="text-12px px-10px py-4px rounded-full bg-white/20" @click="router.push('/myProfile')">
          编辑资料
        </div>
      </div>
      <div class="text-12px mt-12px opacity-90">
        与其在别处仰望，不如在这里并肩
      </div>
    </div>

    <div class="mx-4 mt-14px">
      <div class="rounded-xl bg-white overflow-hidden">
        <div class="relative">
          <img :src="banner" class="h-auto w-full object-cover">
          <div class="left-14px top-14px absolute">
            <div class="text-16px font-700">
              周边市集
            </div>
            <div class="text-12px text-[#606266] mt-4px">
              有没有你的菜
            </div>
          </div>
          <van-button size="small" type="primary" round class="!bottom-14px !right-14px !absolute">
            去看看
          </van-button>
        </div>
      </div>
    </div>

    <div class="mx-4 mt-12px rounded-xl bg-white overflow-hidden">
      <van-cell is-link center @click="goNodata('dynamic')">
        <template #icon>
          <img :src="iconDynamic" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">动态</span>
        </template>
      </van-cell>
      <van-cell is-link center @click="goNodata('collect')">
        <template #icon>
          <img :src="iconCollect" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">收藏</span>
        </template>
      </van-cell>
      <van-cell is-link center @click="goExchange">
        <template #icon>
          <img :src="iconExchange" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">兑换商城</span>
        </template>
      </van-cell>
      <van-cell is-link center @click="router.push('/realnameAuth_new')">
        <template #icon>
          <img :src="iconAuth" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">实名认证</span>
        </template>
      </van-cell>
      <van-cell is-link center @click="router.push('/tabcommunicate_new')">
        <template #icon>
          <img :src="iconService" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">客服</span>
        </template>
      </van-cell>
      <van-cell is-link center @click="router.push('/generalSettings/aboutus')">
        <template #icon>
          <img :src="iconAbout" class="h-18px w-18px">
          <span class="w-3" />
        </template>
        <template #title>
          <span class="text-14px">关于</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bgimg {
  background-image: url('@/assets/tabbar_new/bgimg.png');
  background-size: cover;
}
.my-container {
  min-height: 100vh;
  background: #f6f6f6;
  padding-bottom: 60px;
}
</style>

<route lang="json5">
{
  name: 'MyMine'
}
</route>
