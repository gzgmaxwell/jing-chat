<template>
  <div style="background-color: #EBF0F6;">
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">通知设置</span>
      </template>
    </van-nav-bar>

    <van-cell-group>
      <div class="section-header">应用未打开时</div>
      <van-cell title="新消息通知" is-link="{false}" center :value="newMessage">
        <template #right-icon>
          <van-switch v-model="newMessage" size="24px" @change="newMessageChange" />
        </template>
      </van-cell>

      <van-cell title="语音和视频通话邀请提醒" is-link="{false}" center :value="callInvite">
        <template #right-icon>
          <van-switch v-model="callInvite" size="24px" />
        </template>
      </van-cell>

      <van-cell title="隐藏发送人信息" is-link="{false}" center :value="hideSender">
        <template #right-icon>
          <van-switch v-model="hideSender" size="24px" />
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <div class="section-header">应用打开时</div>
      <van-cell title="声音" is-link="{false}" center :value="sound">
        <template #right-icon>
          <van-switch v-model="sound" size="24px" />
        </template>
      </van-cell>

      <van-cell title="震动" is-link="{false}" center :value="vibration">
        <template #right-icon>
          <van-switch v-model="vibration" size="24px" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import router from "@/router";
const newMessage = ref(true);
const callInvite = ref(true);
const hideSender = ref(false);
const sound = ref(true);
const vibration = ref(false);
const onClickLeft = () => router.back();
// function newMessageChange (){
//     console.log("kkkkk");
//     newMessage.value = !newMessage.value
// }
</script>
  
  <style lang="scss" scoped>
.section-header {
  font-size: 12px;
  color: #8a8a8d;
  padding: 9px 16px;
  background-color: #ebf0f6;
}
:deep(.van-cell__title) {
  font-size: 13px !important;
}
</style>
  