<script setup lang="ts">
import { showFailToast } from 'vant'
import type { UploaderFileListItem } from 'vant'
import uploadArrow from '@/assets/my_new/upload-arrow.png'
import { ResCode } from '@/utils/const'
import { upload } from '@/api/common'

// const { info } = defineProps<{ info: AddPayMethod }>()

const emit = defineEmits<{
  (e: 'getImgUrl', data: string): void
}>()

// 文件读取完成后的处理
const imgUrl = ref([])
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
      imgUrl.value = res.data.url
      // 把上传成功后返回的图片url返回给父组件
      emit('getImgUrl', res.data.url)
      // showToast('修改成功')
    }
  }).catch(() => {
    showFailToast('图片上传失败')
  })
}
</script>

<template>
  <van-uploader v-model="imgUrl" :after-read="onAfterRead" :max-count="1" preview-size="140px">
    <div
      class="border border-gray-300 rounded-lg bg-white flex flex-col h-[140px] w-[140px] items-center justify-center"
    >
      <!-- 自定义上传图标 -->
      <!-- <div class="mb-2 border-2 border-[#0052D9] rounded-full flex h-12 w-12 items-center justify-center"> -->
      <!-- <van-icon name="arrow-up" size="24" color="#0052D9" style="font-weight: bold;" /> -->
      <!-- 如果使用本地图片图标，解开下面注释并注释上面一行 -->
      <img :src="uploadArrow" class="h-10 w-10 object-contain">
      <!-- </div> -->
      <span class="text-base text-[#0052D9] font-medium">上传</span>
    </div>
  </van-uploader>
</template>
