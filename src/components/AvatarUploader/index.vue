<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { showFailToast, showToast } from 'vant'
import type { UploaderFileListItem } from 'vant'
import { upload } from '@/api/common'
import { updateUserInfo } from '@/api/user'
import { useUserStore } from '@/stores'
import { ResCode } from '@/utils/const'

const emit = defineEmits<{
  // 上传成功并刷新tabmy父组件 重新获取用户信息
  (e: 'uploadSuccessAndRefresh'): void
}>()

const userStore = useUserStore()

// 响应式数据
const avatarUrl = ref('')
// const showActionSheet = ref(false)
const uploaderRef = ref()
// 操作选项
/* const actions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'gallery' },
  { name: '取消', value: 'cancel' },
] */

// 本地存储键名
const AVATAR_KEY = 'userInfo'

// 从localStorage加载头像
function loadAvatarFromStorage() {
  const storedAvatar = JSON.parse(localStorage.getItem(AVATAR_KEY)).header
  console.log("storedAvatar",storedAvatar);
  if (storedAvatar) {
    avatarUrl.value = storedAvatar
  }
}

// 保存头像到localStorage
/* function saveAvatarToStorage(url: string) {
  localStorage.setItem(AVATAR_KEY, url)
  avatarUrl.value = url
} */

// 点击头像
function handleAvatarClick() {
  // showActionSheet.value = true
  triggerFileInput()
}

// 选择操作
// function onSelect(action: any) {
//   showActionSheet.value = false

//   if (action.value === 'camera') {
//     triggerFileInput()
//   }
//   else if (action.value === 'gallery') {
//     triggerFileInput()
//   }
// }

// 触发文件选择
function triggerFileInput() {
  if (uploaderRef.value) {
    uploaderRef.value.chooseFile()
  }
}

// 文件读取完成后的处理
function onAfterRead(file: UploaderFileListItem | UploaderFileListItem[]) {
  const fileItem = Array.isArray(file) ? file[0] : file

  if (!fileItem.file) {
    showFailToast('文件读取失败')
    return
  }

  if (!fileItem.file.type.startsWith('image/')) {
    showFailToast('请选择图片文件')
    return
  }

  upload({ file: fileItem.file }).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      updateUserInfo({ header: res.data.url }).then(async (ress) => {
        if (ress.code === ResCode.SUCCESS)
          // 上传成功后重新获取个人信息
          await userStore.getUserInfo()
          avatarUrl.value = JSON.parse(localStorage.getItem("userInfo")).header
          // console.log();
        /* const userInfo = JSON.parse(localStorage.getItem(AVATAR_KEY)) || {}
        userInfo.header = imageUrl
        localStorage.setItem(AVATAR_KEY, JSON.stringify(userInfo)) */
        emit('uploadSuccessAndRefresh')
        showToast('头像修改成功')
      })
      // 假设返回的响应中包含图片的URL
      /*  const imageUrl = res.data.url
       avatarUrl.value = imageUrl */
    }
  }).catch(() => {
    showFailToast('头像上传失败')
  })
  // const objectUrl = URL.createObjectURL(fileItem.file)
  // saveAvatarToStorage(objectUrl)
  // showToast('头像更新成功')
}

// 组件挂载时加载头像
onMounted(() => {
  loadAvatarFromStorage()
})
</script>

<template>
  <div class="inline-block">
    <div class="cursor-pointer" @click="handleAvatarClick">
      <div class=" bg-#f5f5f5 flex  items-center justify-center relative overflow-hidden" style="border-radius: 50%; width:30px;height:30px">
        <img v-if="avatarUrl" :src="avatarUrl" alt="头像" class="h-full w-full object-cover">
        <div v-else class="text-#c8c9cc flex h-full w-full items-center justify-center">
          <van-icon name="user-o" size="24" />
        </div>
        <!-- <div
          class="text-10px text-white leading-1.2 bg-black bg-opacity-60 flex flex-col h-1/3 items-center bottom-0 left-0 right-0 justify-center absolute"
        >
          <van-icon name="photograph" size="16" />
        </div> -->
      </div>
    </div>

    <!-- 图片选择弹窗 -->
    <!-- <van-action-sheet v-model:show="showActionSheet" :actions="actions" @select="onSelect" /> -->

    <!-- 文件上传组件 -->
    <van-uploader v-show="false" ref="uploaderRef" :after-read="onAfterRead" :max-count="1" accept="image/*" />
  </div>
</template>
