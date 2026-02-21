<script setup lang="ts">
import arrowRight from '@/assets/tabbar_new/my/arrow_right.png'
import authAvatar from '@/assets/tabbar_new/my/authAvatar.png'

// TODO: 本地资源
const images = {
  faceIcon: '/src/assets/images/face-verify-icon.png',
}

const checked = ref(false)
const showCamera = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)

const onClickLeft = () => history.back()

function startVerification() {
  if (!checked.value) {
    return showToast('请先勾选协议')
  }
  openCamera()
}

async function openCamera() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    })
    stream.value = mediaStream
    showCamera.value = true

    // 等待 DOM 更新后绑定视频流
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream
      }
    }, 100)

    // 模拟识别成功
    setTimeout(() => {
      showToast({ type: 'success', message: '识别成功' })
      closeCamera()
      setTimeout(() => history.back(), 1000)
    }, 5000)
  }
  catch (error) {
    showDialog({ title: '无法开启摄像头', message: '请检查浏览器权限设置' })
  }
}

function closeCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  showCamera.value = false
}

onUnmounted(() => {
  closeCamera()
})
</script>

<template>
  <div class="font-sans bg-white flex flex-col h-screen">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">高级实名认证</span>
      </template>
    </van-nav-bar>

    <div class="p-4 pb-32 flex-1 overflow-y-auto">
      <div class="text-sm text-gray-400 mb-6">
        为保证您的账号安全，请先完成实名认证
      </div>

      <!-- 步骤条 -->
      <!-- 修改点：items-center -> items-start，实现顶端对齐，方便计算 margin -->
      <div class="mb-10 px-2 flex items-start justify-between">
        <!-- Step 1 -->
        <div class="flex flex-col gap-1 items-center">
          <div class="text-sm text-white font-bold rounded-full bg-blue-600 flex h-8 w-8 items-center justify-center">
            1
          </div>
          <span class="text-xs text-blue-600">身份信息</span>
        </div>

        <!-- 箭头：mt-[9px] 居中对齐圆圈 -->
        <img :src="arrowRight" class="mt-[9px] h-[14px] w-[14px] object-contain" alt="icon">

        <!-- Step 2 -->
        <div class="flex flex-col gap-1 items-center">
          <div class="text-sm text-white font-bold rounded-full bg-blue-600 flex h-8 w-8 items-center justify-center">
            2
          </div>
          <span class="text-xs text-blue-600">初级认证</span>
        </div>

        <img :src="arrowRight" class="mt-[9px] h-[14px] w-[14px] object-contain" alt="icon">

        <!-- Step 3 (Active) -->
        <div class="flex flex-col gap-1 items-center">
          <div class="text-sm text-white font-bold rounded-full bg-blue-600 flex h-8 w-8 items-center justify-center">
            3
          </div>
          <span class="text-xs text-blue-600">人脸识别</span>
        </div>

        <img :src="arrowRight" class="mt-[9px] h-[14px] w-[14px] object-contain" alt="icon">

        <!-- Step 4 -->
        <div class="flex flex-col gap-1 items-center">
          <div class="text-sm text-white font-bold rounded-full bg-gray-400 flex h-8 w-8 items-center justify-center">
            4
          </div>
          <span class="text-xs text-gray-400">高级认证</span>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="flex flex-col items-center">
        <h2 class="text-lg text-black font-bold mb-8">
          人像验证
        </h2>

        <!-- 大图标 -->
        <div class="mb-8 flex h-40 w-40 items-center justify-center">
          <!-- 替换为本地图片 -->
          <!-- <div class="i-mdi:account text-8xl text-blue-300" /> -->
          <img :src="authAvatar" class="rounded-full h-full w-full">
        </div>

        <!-- 提示框 -->
        <div class="mb-8 p-4 rounded-lg bg-[#F0F4F8] w-full">
          <div class="text-sm text-black font-bold mb-1">
            您知悉并同意应用提供者：
          </div>
          <div class="text-xs text-gray-500 leading-relaxed">
            收集、使用您本人的身份信息和人脸图像向合法数据持有者核实您的身份信息本操作数据仅用于身份核实，安全可靠
          </div>
        </div>
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="p-4 bg-white bottom-0 left-0 right-0 fixed z-10">
      <div class="mb-4 flex items-start">
        <van-checkbox v-model="checked" icon-size="12px" checked-color="#0052ff" />
        <span
          class="text-12px text-gray-400 leading-none"
          @click="checked = !checked"
        >上述为个人敏感信息，您知悉并同意《个人信息处理授权协议》，如拒绝授权，将无法使用功能</span>
      </div>
      <van-button
        block type="primary" color="#0052ff" class="text-base font-bold rounded-lg h-12"
        @click="startVerification"
      >
        同意授权并继续
      </van-button>
    </div>

    <!-- 摄像头覆盖层 -->
    <div v-if="showCamera" class="bg-black flex flex-col inset-0 fixed z-50">
      <!-- 顶部操作栏 -->
      <div class="p-4 flex items-center left-0 right-0 top-0 justify-between absolute z-20">
        <div class="rounded-full bg-black/30 flex h-8 w-8 items-center justify-center" @click="closeCamera">
          <div class="i-mdi:close text-xl text-white" />
        </div>
      </div>

      <!-- 视频流 -->
      <video ref="videoRef" autoplay playsinline webkit-playsinline class="h-full w-full object-cover" />

      <!-- 遮罩层 -->
      <div class="flex pointer-events-none items-center inset-0 justify-center absolute">
        <!-- 圆形镂空效果 -->
        <div
          class="border-2 border-blue-500 rounded-full h-72 w-72 shadow-[0_0_0_2000px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          <!-- 扫描动画 -->
          <div class="animate-scan bg-blue-500 h-1 w-full shadow-[0_0_15px_#3b82f6] left-0 top-0 absolute" />
        </div>
      </div>

      <!-- 提示文字 -->
      <div class="text-white text-center bottom-20 left-0 right-0 absolute z-20">
        <div class="text-xl font-bold mb-2">
          请正对屏幕
        </div>
        <div class="text-sm opacity-70">
          保持光线充足，不要遮挡面部
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% {
    top: 0;
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    top: 100%;
    opacity: 0;
  }
}

.animate-scan {
  animation: scan 2s linear infinite;
}

:deep(.van-checkbox) {
  overflow: inherit;
}
</style>
