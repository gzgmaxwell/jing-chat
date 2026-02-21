<script setup lang="ts">
import { otclogout } from "@/api/user";
import router from "@/router";
import share from "@/assets/tabbar_new/my/share.png";
import about from "@/assets/tabbar_new/my/about.png";
import update from "@/assets/tabbar_new/my/update.png";
import sharecode from "@/assets/tabbar_new/my/sharecode.png";
import linkicon from "@/assets/tabbar_new/my/linkicon.png";
import iconpro from "@/assets/tabbar_new/my/iconpro.png";
import shareImg from "@/assets/tabbar_new/my/shareImg.png";
import shareTitle from "@/assets/tabbar_new/my/shareTitle.png";
import saveImg from "@/assets/tabbar_new/my/saveImg.png";
import moreIcon from "@/assets/tabbar_new/my/moreIcon.png";
import updateIcon from "@/assets/tabbar_new/my/updateIcon.png";
import { ResCode } from "@/utils/const";
import { useClipboard } from "@vueuse/core";
import { clearToken } from "@/utils/auth";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const showShare = ref(false);
const updateShow = ref(false);
const { copy, isSupported } = useClipboard();
const options = [
  {
    name: "保存图片",
    icon: saveImg
  },
  {
    name: "复制链接",
    icon: linkicon
  },
  {
    name: "更多",
    icon: moreIcon
  }
];
const imageUrl = 'https://h5.jingchat.com.cn/otc/api/view/apk/ewm.png';
// 退出登录
function logout() {
  otclogout().then(res => {
    if (res.code === ResCode.SUCCESS) {
      clearToken();
      localStorage.removeItem("userInfo");
      router.push("/login");
    }
  });
}
function onSelectOption(optionName: string) {
  console.log("optionName",optionName);
  if (optionName.name === '保存图片') {
    downloadImage(imageUrl);
  } else if (optionName.name === '复制链接') {
    copyToClipboard(imageUrl);
  } else if (optionName.name === '更多') {
    // 这里可以扩展更多操作
  shareUrl(imageUrl)
  }
}
 async function copyToClipboard(imageUrl:any){
    if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {
    await copy(imageUrl);
   showToast("已复制")
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
}
function downloadImage(url: string) {
 // 创建一个隐藏的 a 标签
  const link = document.createElement('a')
  link.href =url
  link.download = 'GUPay'

  // 触发点击事件实现下载
  document.body.appendChild(link) // 兼容性考虑，先加到 DOM
  link.click()
  document.body.removeChild(link)
}
function shareUrl(url: string) {
  const shareData = {
    title: "分享标题",
    text: "这是分享内容",
    url: url // 需要分享的地址
  };
  console.log(shareData.value, "shareData");
  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => {
        console.log("分享成功");
      })
      .catch(error => {
        console.error("分享失败：", error);
      });
  } else {
    // fallback: 复制链接
    fallbackCopyTextToClipboard(shareData.url)
      .then(() => {
        alert("链接已复制到剪贴板，请分享到您的应用中");
      })
      .catch(() => {
        alert(
          "浏览器不支持分享功能，也无法复制链接，请手动复制链接：\n" +
            shareData.url
        );
      });
  }
}
function fallbackCopyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // 兼容旧浏览器的复制方案
    return new Promise(function(resolve, reject) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; // 避免滚动条影响
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        successful ? resolve() : reject();
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }
}
</script>

<template>
  <div class="font-sans flex flex-col h-screen" style="background-color:#EBF0F6;">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">通用设置</span>
      </template>
    </van-nav-bar>
    <div class="bg-white overflow-hidden mt-4">
      <van-cell is-link center @click="showShare = true">
        <template #title>
          <span class="text-sm ml-2">分享GUPay</span>
        </template>
        <template #icon>
          <van-image :src="share" width="18px" height="18px" />
        </template>
      </van-cell>
      <van-cell is-link center @click="router.push('/generalSettings/aboutus')">
        <template #title>
          <span class="text-sm ml-2">关于我们</span>
        </template>
        <template #icon>
          <van-image :src="about" width="18px" height="18px" />
        </template>
      </van-cell>
    </div>
    <!-- Logout Button -->
    <div class="mt-4">
      <div class="border-none" @click="isLogoutShow = true">退出登录</div>
    </div>
    <van-popup v-model:show="isLogoutShow" position="bottom" style=" border-radius:8px 8px 0 0; ">
      <div
        class="text-12px text-[#8A8A8D] text-center"
        style="padding:15px 15px 0 15px; box-sizing: border-box"
      >
        <p>退出后不会删除任何历史数据，下次登录依然可以使用本账号</p>
      </div>
      <van-divider :style="{  borderColor: '#D8D8D8', }" />
      <div class="flex flex-col space-y-3">
        <div class="logout-style" @click="logout" style="color: #0256FF;">退出登录</div>
        <van-divider />

        <div class="logout-style" @click="isLogoutShow = false">取消</div>
      </div>
    </van-popup>
    <van-popup
      v-model:show="showShare"
      position="center"
      style=" z-index:2014;border-radius: 8px; "
    >
      <div class="share-container" :style="{ backgroundImage: `url(${shareImg})` }">
        <div class="share-top">
          <img :src="shareTitle" alt style="background-size: 100%;width:100%; height:100%; " />
        </div>
        <div class="share-code">
          <img
            src="https://h5.jingchat.com.cn/otc/api/view/apk/ewm.png"
            alt
            style="background-size: 100%;width:100%; height:100%; "
          />
        </div>
        <div class="share-bottom">
          <img :src="iconpro" alt style="background-size: 100%;width:100%; height:100%; " />
        </div>
      </div>
    </van-popup>

    <!-- 分享面板 -->
    <van-share-sheet v-model:show="showShare" title="分享到" :options="options" overlay="false"  @select="onSelectOption"/>
  </div>
</template>
<style lang="scss" scoped>
.border-none {
  margin: 145px auto;
  width: 300px;
  height: 45px;
  background: #ff4d4f;
  border-radius: 8px 8px 8px 8px;
  font-weight: 700;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  line-height: 45px;
}
.logout-style {
  text-align: center;
}
:deep(.van-share-sheet__options) {
  justify-content: space-around;
}
:deep(.van-share-sheet__image-icon) {
  width: 25px;
  height: 25px;
}
:deep(.van-popup--center) {
  top: 34%;
}
.share-container {
  width: 343px;
  height: 379px;
  background: #ffffff;
  background-size: 100%;
  background-repeat: no-repeat;
  position: relative;
}
.share-top {
  width: 63px;
  margin: 0 auto;
  text-align: center;
  padding-top: 22px;
  box-sizing: border-box;
}
.share-code {
  width: 92px;
  height: 92px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 55%;
}
.share-bottom {
  position: absolute;
  left: 105px;
  bottom: 3%;
  width: 36px;
  height: 36px;
}
.update-tip {
  width: 138px;
  height: 138px;
  background: #1a1a1a;
  border-radius: 8px 8px 8px 8px;
  opacity: 0.6;
  padding-top: 29px;
}
.update-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto;
}
.update-content {
  font-size: 12px;
  color: #ffffff;
  line-height: 17px;
  text-align: center;
  margin-top: 10px;
}
</style>