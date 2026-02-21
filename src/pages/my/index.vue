<script setup lang="ts">
import male from '../../assets/icons/my_svg/male.svg'
import female from '../../assets/icons/my_svg/female.svg'
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'
import router from '@/router'

// 使用useClipboard
const { copy, isSupported } = useClipboard()

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const avatar = ref(userInfo.avatar)
const nickName = ref(userInfo.nickName)
const id = ref(userInfo.onlyCode)
const slogan = ref(userInfo.slogan)

const gender = computed(() => {
  if (userInfo.gender === 0)
    return male
  else if (userInfo.gender === 1)
    return female
  return ''
})

// 复制id
async function copyId() {
  if (!isSupported) {
    showToast('您的浏览器不支持复制功能')
    return
  }
  try {
    await copy(id.value)
    showToast('已复制到剪切板')
  }
  catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请重试')
  }
}
</script>

<template>
  <div class="flex flex-col">
    <!-- 头部区域 -->
    <header
      class="text-white rounded-none flex-shrink-0 h-[238px] w-[375px] from-[#0B6DFF] to-[rgba(4,16,246,0.5)] bg-gradient-to-tr"
    >
      <div class="p-6 flex items-center justify-between">
        <div />
        <div class="flex items-center">
          <img src="../../assets/icons/my_svg/settings-fill.svg" @click="router.push('/settings')">
        </div>
      </div>
      <div class="p-5 pt-8 flex items-center">
        <img :src="avatar || '../../assets/icons/my_svg/avatar_default.svg'" class="mr-4 rounded-12px h-75px w-75px">
        <div class="flex flex-col h-17 justify-between">
          <div class="icon-text flex items-center">
            <h1 class="text-xl font-bold">
              {{ nickName || '用户名' }}
            </h1>
            <img :src="gender" class="text-lg inline-block">
          </div>
          <div class="icon-text flex items-center">
            <p class="text-sm">
              ID：{{ id || '' }}
            </p>
            <img src="../../assets/icons/my_svg/copy.svg" class="text-lg ml-1.5 inline-block" @click="copyId">
          </div>
        </div>
        <!-- <div class="flex flex-col h-17 justify-between">
          <h1 class="text-xl font-bold">
            JingChat
          </h1>
          <p class="text-sm mt-1">
            ID: PF100002
          </p>
        </div> -->
        <div
          class="text-13px text-[#D1D1D1] flex items-center pos-right-6 pos-absolute"
          @click="router.push('/editProfile')"
        >
          编辑资料
          <img src="../../assets/icons/my_svg/arrow_right.svg" class="text-lg h-3.5 w-3.5 inline-block">
        </div>
      </div>
      <div class="pl-5">
        <p class="text-3.5 text-white max-w-[70vw] whitespace-nowrap text-ellipsis overflow-hidden">
          {{ slogan || '' }}
        </p>
      </div>
    </header>

    <!-- 功能列表区域 -->
    <section class="bg-gray-50 flex-grow">
      <van-cell-group class="mt-2 rounded-lg bg-white">
        <van-cell title="动态" is-link @click="router.push({ path: `/nodata`, query: { url: 'dynamic' } })">
          <template #icon>
            <img src="../../assets/icons/my_svg/dynamic.svg">
            <span class="w-3" />
          </template>
        </van-cell>
        <van-cell title="收藏" is-link @click="router.push({ path: `/nodata`, query: { url: 'collect' } })">
          <template #icon>
            <img src="../../assets/icons/my_svg/collect.svg">
            <span class="w-3" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="mt-2 rounded-lg bg-white">
        <van-cell title="实名认证" is-link @click="router.push('/realNameAuth')">
          <template #icon>
            <img src="../../assets/icons/my_svg/auth.svg">
            <span class="w-3" />
          </template>
        </van-cell>
        <van-cell icon="gift" title="客服&反馈" is-link>
          <template #icon>
            <img src="../../assets/icons/my_svg/service.svg">
            <span class="w-3" />
          </template>
        </van-cell>
        <van-cell icon="gift" title="关于" is-link>
          <template #icon>
            <img src="../../assets/icons/my_svg/about.svg">
            <span class="w-3" />
          </template>
        </van-cell>
      </van-cell-group>
    </section>
  </div>
</template>

<style scoped>
.van-cell {
  --van-cell-font-size: 15px;
}
</style>

<route lang="json5">
{
  name: 'My'
}
</route>
