<script setup lang="ts">
import router from "@/router";
import five from "@/assets/tabbar_new/my/tongyong.png";
import copyimg from "@/assets/tabbar_new/my/copy.png";
import QRCode from "qrcode";
import { getCurUserInfo } from "@/api/user";
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();
const userInfo = ref({});
const mycodeImg = ref("");
import { useClipboard } from "@vueuse/core";
// 使用useClipboard
const { copy, isSupported } = useClipboard();

// 复制订单编号
async function copyNum(val:any) {
  if (!isSupported) {
    showToast("您的浏览器不支持复制功能");
    return;
  }
  try {
    await copy(val);
    showToast("已复制");
  } catch (error) {
    console.error("复制失败:", error);
    showToast("复制失败，请重试");
  }
}
onMounted(() => {
  // 异步获取最新用户信息
  getCurUserInfo().then(res => {
    userInfo.value = res.data; // 赋值给store的响应式状态

    codeGenerate();
  });
});

function codeGenerate() {
  console.log("userInfo.value2222", userInfo.value);
  QRCode.toDataURL(userInfo.value?.walletAddress)
    .then(url => {
      console.log(url);
      mycodeImg.value = url;
      // 你可以将url赋值给<img src="url" />的src属性展示二维码
    })
    .catch(err => {
      console.error(err);
    });
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

function shareUrl() {
  const shareData = {
    title: "分享标题",
    text: "这是分享内容",
    url: userInfo.value?.walletAddress // 需要分享的地址
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
// 下载
function downloadBase64Image(): void {
  // 创建一个隐藏的 a 标签
  const link = document.createElement('a')
  link.href = mycodeImg.value
  link.download = '收款码'

  // 触发点击事件实现下载
  document.body.appendChild(link) // 兼容性考虑，先加到 DOM
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="font-sans flex flex-col h-screen bg-[#ECF1F7]">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">收款</span>
      </template>
    </van-nav-bar>
    <div class="h-169px bg-white mt-21px flex p-13px">
      <div class="w-143px h-143px" style="min-width: 143px;">
        <img :src="mycodeImg" alt style="width: 100%; height:100%;" />
      </div>
      <div class="ml-8px">
        <div class="text-sm font-mono w-200px break-words">
          <span class="text-14px text-[#000]">{{userInfo?.walletAddress}}</span>
          <van-icon name="sign" @click="copyNum(userInfo?.walletAddress)" />
        </div>
        <van-divider :style="{  borderColor: '#D8D8D8',height:'2px',marginTop:'31px', }" />
        <div class="flex justify-around">
          <div class="share-url" @click="shareUrl">分享地址</div>
          <div class="share-url" style="color: #FFFFFF;background: #0256FF;" @click="downloadBase64Image">保存二维码</div>
        </div>
      </div>
    </div>
    <div class="text-14px mt-20px">
      最小充值数
      <span style="color: #0256FF;">10.00</span> GUB
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
.share-url {
  width: 88px;
  height: 50px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #0256ff;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
}
</style>