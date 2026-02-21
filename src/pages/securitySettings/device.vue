<script setup lang="ts">
import router from "@/router";
import { ref, computed, watch } from "vue";
import { getDevice } from "@/api/user";
import { ResCode } from "@/utils/const";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const records = ref([]);
getDevice().then(res => {
  if (res.code === ResCode.SUCCESS) {
    console.log("res.code", res);
    records.value = res.data;
  }

  // showToast('转账成功')
});
</script>

<template>
  <div class="font-sans flex flex-col h-screen bg-white" style="overflow: auto;">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">登录设备管理</span>
      </template>
    </van-nav-bar>
    <div class="p-12px">
      <div class="text-12px" style="color: #909090;">最近登录设备：你可以删除列表中的设备，删除后在该设备登录时需要进行身份验证</div>
      <div v-for="item in records" style="padding:0 8px;margin-top: 13px;">
        <div class="device-style">
          <div class="text-14px">
          {{ item.deviceModel ||'暂无'}}
          </div>
          <div class="text-12px pt-6px" style="color: #909090;">
          {{ item.updateTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.about-content {
  padding: 12px 26px;
  font-size: 12px;
  color: #000000;
  line-height: 17px;
}
.device-style{
    padding: 8px 12px;
    background: #f2f9fd;
    border-radius: 8px;
}
</style>