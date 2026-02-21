<script setup lang="ts">
import { otclogout, updateUserInfo } from '@/api/user'
import { useUserStore } from '@/stores'
import router from '@/router'
import { ResCode } from '@/utils/const'
import { showFailToast } from 'vant'
import { clearToken } from '@/utils/auth'
import { useClipboard } from '@vueuse/core'

const userStore = useUserStore()
// 使用useClipboard
const { copy, isSupported } = useClipboard()

const activeTab = ref(4) // Set "我的" as active
const nicknameShow = ref(false)
const isAvatarPopShow = ref(false)
const isLogoutShow = ref(false)
const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('userInfo'))
const nickname = ref(userInfo.value?.nickName || '')

// 复制钱包地址逻辑
// 复制id
async function copyAddress(param) {
  if (!isSupported) {
    showToast('您的浏览器不支持复制功能')
    return
  }
  try {
    await copy(param === 'phone' ? userInfo.value.phoneNum : userInfo.value.walletAddress)
    param === 'phone' ? showToast('手机号已复制') : showToast('钱包地址已复制')
  }
  catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败，请重试')
  }
}
/* function copyAddress(param) {
  navigator.clipboard.writeText(param === 'phone' ? userInfo.value.phoneNum : userInfo.value.walletAddress).then(() => {
    param === 'phone' ? showToast('手机号已复制') : showToast('钱包地址已复制')
  })
} */

// 刷新用户信息
function refresh() {
  location.reload()
}

// 改昵称
function updateNickName() {
  updateUserInfo({ nickName: nickname.value }).then(async (res) => {
    if (res.code === ResCode.SUCCESS) {
      // 上传成功后重新获取个人信息
      await userStore.getUserInfo()
      showToast('昵称修改成功')
    }
    refresh()
  }).catch(() => {
    showFailToast('昵称修改失败')
  })
}

// 退出登录
function logout() {
  otclogout().then((res) => {
    if (res.code === ResCode.SUCCESS) {
      clearToken()
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  })
}
</script>

<template>
  <div class="font-sans">
    <!-- Profile Header -->
    <div class="text-white p-4 bg-blue-500">
      <div
        class="w-65x text-xl p-8px rounded-12.5px bg-[#0949AA] flex h-25px items-center right-16px absolute space-x-3"
      >
        <i class="i-carbon-headset text-16px" />
        <i class="i-carbon-email text-16px" />
      </div>
      <div class="mt-2 flex items-center">
        <!-- <van-image
          radius="8px" width="55px" height="55px" fit="cover" src="https://i.imgur.com/example-avatar.png"
          @click="isAvatarPopShow = true"
        /> -->
        <avatar-uploader @upload-success-and-refresh="refresh" />
        <div class="ml-4">
          <div class="flex items-center">
            <span class="text-lg font-bold">{{ userInfo?.nickName || '设置昵称' }}</span>
            <i class="i-carbon-edit text-lg ml-2 cursor-pointer" @click="nicknameShow = true" />
          </div>
          <div class="text-sm mt-2 flex items-center">
            <span class="text-[#D8D8D8]">+86 {{ userInfo?.phoneNum || '' }}</span>
            <i class="i-carbon-copy ml-2 cursor-pointer" @click="copyAddress('phone')" />
          </div>
        </div>
      </div>
      <div class="p-4 pb-0 rounded-lg">
        <span class="text-14px text-[#D8D8D8]">余额</span>
        <span class="text-24px font-bold ml-3 mt-1">
          {{ userInfo?.totalBalance || '0.00' }} <span class="text-12px text-[#D8D8D8] font-normal">GDB</span>
        </span>
        <div class="text-sm pt-4 flex items-center">
          <i class="i-carbon-wallet text-14px text-[#D8D8D8] mr-2" />
          <span class="text-[#D8D8D8]">钱包地址:</span>
          <span class="font-mono ml-2 max-w-45% truncate">{{ userInfo?.walletAddress || '' }}</span>
          <i v-if="!!userInfo?.walletAddress" class="i-carbon-copy ml-2 cursor-pointer" @click="copyAddress('address')" />
        </div>
      </div>
    </div>

    <main class="p-4">
      <!-- Balance & Wallet Card -->

      <!-- Actions Grid -->
      <div class="p-2 rounded-lg bg-white">
        <van-grid :border="false" :column-num="4">
          <van-grid-item icon="user-circle-o" text="实名认证" />
          <van-grid-item icon="lock" text="支付密码" />
          <van-grid-item icon="paid" text="收付款方式" />
          <van-grid-item icon="records" text="资金明细" />
        </van-grid>
      </div>

      <!-- Menu -->
      <div class="mt-4">
        <van-cell-group inset>
          <van-cell title="邮箱绑定" is-link />
          <van-cell title="密码登录" is-link />
          <van-cell title="我的设备" is-link />
          <van-cell title="分享GDPay" is-link />
          <van-cell title="关于我们" is-link />
          <van-cell title="检查更新" is-link />
        </van-cell-group>
      </div>

      <!-- Logout Button -->
      <div class="mt-4">
        <van-button type="default" block class="!border-none" @click="isLogoutShow = true">
          退出登录
        </van-button>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <van-tabbar v-model="activeTab" active-color="#1989fa">
      <van-tabbar-item icon="home-o">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="exchange">
        交易
      </van-tabbar-item>
      <van-tabbar-item icon="scan">
        扫码
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o">
        订单
      </van-tabbar-item>
      <van-tabbar-item icon="user-o">
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
  <van-popup v-model:show="nicknameShow" closeable round :style="{ padding: '20px', width: '90%' }">
    <div class="text-center">
      <h3 class="font-bold mb-4">
        昵称修改
      </h3>
      <van-field v-model="nickname" placeholder="昵称限制2-8位长度" class="mb-4 rounded-lg bg-[#ECF1F7]" />
      <van-button type="primary" color="#0256FF" block class="mt-4" @click="updateNickName(); nicknameShow = false">
        提交
      </van-button>
    </div>
  </van-popup>
  <van-popup v-model:show="isAvatarPopShow" position="bottom" :style="{ padding: '15px', background: 'transparent' }">
    <!-- <div class="text-center">
      <van-uploader
        v-model="avatarFile" :after-read="(file) => { console.log(file); isAvatarPopShow = false }"
        accept="image/*" max-size="5000000" class="mb-4" :preview-image="true" :max-count="1"
      />
    </div> -->
    <van-cell-group inset>
      <van-cell title="拍照" class="cell-title">
        <template #right-icon>
          <van-icon name="search" color="#0256FF" class="search-icon" />
        </template>
      </van-cell>
      <van-cell title="从手机相册选择" class="cell-title">
        <template #right-icon>
          <van-icon name="search" color="#0256FF" class="search-icon" />
        </template>
      </van-cell>
    </van-cell-group>
    <div class="mt-4">
      <van-button style="border: none" type="default" plain color="#0256FF" block @click="isAvatarPopShow = false">
        取消
      </van-button>
    </div>
  </van-popup>

  <van-popup v-model:show="isLogoutShow" position="bottom" :style="{ padding: '15px' }">
    <!-- <van-cell-group inset>
      <van-cell title="退出登录" class="cell-title">
        <template #right-icon>
          <van-icon name="search" color="#0256FF" class="search-icon" />
        </template>
      </van-cell>
    </van-cell-group>
    <van-button style="border: none" type="default" plain color="#0256FF" block @click="isAvatarPopShow = false">
      取消
    </van-button> -->
    <div class="text-12px text-[#8A8A8D] mb-6 text-center">
      <p>退出后不会删除任何历史数据，下次登录依然可以使用本账号</p>
    </div>
    <div class="flex flex-col space-y-3">
      <van-button type="primary" @click="logout">
        退出登录
      </van-button>
      <van-button type="default" @click="isLogoutShow = false">
        取消
      </van-button>
    </div>
  </van-popup>
</template>

<style scoped>
:deep(.cell-title .van-cell__title) {
  color: #0256ff;
}
</style>

<route lang="json5">
{
  name: 'My'
}
</route>
