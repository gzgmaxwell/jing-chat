<script setup lang="ts">
import router from "@/router";

const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
</script>

<template>
  <div class="font-sans flex flex-col h-screen">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">关于我们</span>
      </template>
    </van-nav-bar>
    <div class="about-content">
      <div>GUpay跨境加密货币金流服务，一个引领金融的钱包。致力于为全球用户提供最安全的支付和资产管理服务。极致体验安全高效 持续为客户创造更多价值...</div>
      <div style="margin-top: 20px;">GUpay是以千万级用户的商家为基础，为上万个客户提供安全、灵活、快速的数字支付业务。安全无风险，支付新趋势!</div>
      <div>☆客户对客户一对一自由交易，用时短，速度快，可采用支付宝，微信，银行卡等进行交易!</div>
      <div>☆支付稳定，大额无忧，拥有业内顶尖的安全团队，搭建了完善的风险控制架构，确保账户安全,交易更放心!</div>
      <div>☆不受时间及国界限制，无论何时何地都能完成交易安全高效,无需远行即可畅玩全球! ☆汇率稳定性高，恒定人民币币值1:1 100%互兑! 7x24h客服在线，随时响应客户需求!</div>
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
</style>