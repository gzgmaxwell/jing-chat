<script setup lang="ts">
import { showFailToast } from 'vant'
import type { UploaderFileListItem } from 'vant'
import { ResCode } from '@/utils/const'
import { upload } from '@/api/common'
import camera from '@/assets/tabbar_new/my/camera.png'

const props = defineProps({
  content: {
    type: String,
    default: '内容',
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'getImgUrl', data: string): void
  (e: 'update:modelValue', data: string): void
}>()

// 文件列表
const fileList = ref<UploaderFileListItem[]>([])

// 监听传入的图片URL变化
watch(() => props.modelValue, (newValue) => {
  if (newValue && !fileList.value.length) {
    fileList.value = [{
      url: newValue,
      isImage: true,
      status: 'done',
      message: '上传成功',
    }]
  }
  else if (!newValue && fileList.value.length) {
    fileList.value = []
  }
}, { immediate: true })

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

  // 显示上传状态
  fileItem.status = 'uploading'
  fileItem.message = '上传中...'

  upload({ file: fileItem.file }).then((res) => {
    if (res.code === ResCode.SUCCESS) {
      fileItem.status = 'done'
      fileItem.message = '上传成功'
      fileItem.url = res.data.url

      // 更新文件列表
      fileList.value = [fileItem]

      // 把上传成功后返回的图片url返回给父组件
      emit('getImgUrl', res.data.url)
      emit('update:modelValue', res.data.url)
    }
    else {
      fileItem.status = 'failed'
      fileItem.message = '上传失败'
    }
  }).catch(() => {
    fileItem.status = 'failed'
    fileItem.message = '上传失败'
    showFailToast('图片上传失败')
  })
}

// 删除图片处理
function onDelete(file: UploaderFileListItem) {
  // 清空文件列表
  fileList.value = []

  // 通知父组件清空图片
  emit('getImgUrl', '')
  emit('update:modelValue', '')

  return true // 返回true允许删除
}
</script>

<template>
  <van-uploader
    v-model="fileList" :after-read="onAfterRead" :max-count="1" class="flex-1" preview-size="100%"
    @delete="onDelete"
  >
    <template #default>
      <div
        class="border border-gray-400 rounded-[6px] border-dashed bg-[#F0F4F8] flex flex-col w-full aspect-[8/5] items-center justify-center"
      >
        <div class="mb-2 rounded-full bg-white flex h-50px w-50px items-center justify-center">
          <img :src="camera" class="h-[25px] w-[25px] object-contain" alt="icon">
        </div>
        <span class="text-xs text-blue-600">{{ props.content }}</span>
      </div>
    </template>
  </van-uploader>
</template>

<!-- <style scoped>
:deep(.van-image__img) {
  aspect-ratio: 8/5;
}
</style> -->
