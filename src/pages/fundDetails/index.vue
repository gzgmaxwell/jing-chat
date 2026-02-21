

<template>
  <div class="font-sans flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-white font-bold">资金明细</span>
      </template>
    </van-nav-bar>
    <div class="fund-style">
      <div class="fund-text">
        余额
        <span style="font-size: 24px;">{{cachedUserInfo.totalBalance}}.00</span> GUB
      </div>
      <div class="flex justify-between mt-17px text-white text-14px" style="padding: 0 19px;">
        <div>可售 {{cachedUserInfo.money}}.00</div>
        <div class="flex">
          不可售 {{cachedUserInfo.unavailableBalance}}.00
          <img :src="wen" alt class="w-14px h-14px mt-4px ml-4px" />
        </div>
      </div>
    </div>
    <div v-for="item in records" style="padding:0 16px;margin-top: 13px;">
      <div class="flex">
        <div class="re-left">
          <img
            :src="item.fromHeader"
            style="border-radius: 50%;  width:35px;
              height:35px;"
          />
        </div>
        <div style="flex: 1;">
          <div class="flex ml-4px justify-between">
            <div>
              <div class="text-14px">{{item.title}}-转给{{ item.purposeNickName }}</div>
              <div class="text-12px">{{item.createTime}}</div>
            </div>
            <div style="text-align: right;">
              <div class="text-14px">{{item.viewMoney}}</div>
              <div class="text-12px">{{item.id}}</div>
            </div>
          </div>
          <div>
            <van-divider :style="{padding:'0',borderColor: '#E5E5E5',height:'4px',}" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import router from "@/router";
import wen from "@/assets/tabbar_new/my/wen.png";
import { getFundList } from "@/api/transfer";
import { ResCode } from "@/utils/const";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
const records = ref([]);
getFundList().then(res => {
  if (res.code === ResCode.SUCCESS) {
    console.log("res.code", res);
    records.value = res.data;
  }

  // showToast('转账成功')
});
</script>
<style lang="scss" scoped>
:deep(.van-nav-bar__content) {
  background: #0256ff;
}
.fund-style {
  width: 100vw;
  height: 100px;
  background: #0256ff;
}
.fund-text {
  font-size: 14px;
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
}
</style>