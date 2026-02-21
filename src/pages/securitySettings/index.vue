<template>
  <div style="background-color: #EBF0F6;">
    <van-nav-bar title="安全设置" left-text left-arrow @click-left="onBack" />
    <!-- <van-cell-group>
      <van-cell title="登录密码" is-link @click="onClickItem('loginPassword')">
        <template #right-icon>
          <template v-if="loginPassword.status === '未设置'">
            <div class="password-style">
              <div class="ps-img">
                <img :src="sectip" alt style="width: 100%;height:100%; background-size:100%;" />
              </div>
              <div class="ps-content">未设置</div>
              <div class="ps-left">
                <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
              </div>
            </div>
          </template>
        </template>
      </van-cell>
      <van-cell title="安全密码" is-link value="修改安全密码" @click="onClickItem('securityPassword')" />
    </van-cell-group>-->

    <van-cell-group style="margin-top: 10px;">
      <van-cell title="手机号" is-link @click="router.push('/securitySettings/changePhone')">
        <template #icon>
          <div class="password-style">
            <div class="ps-left" style="margin-right: 3px;">
              <img :src="secwarn" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
        <template #right-icon>
          <div class="password-style">
            <div v-if="!cachedUserInfo.phoneNum">
              <div class="ps-img">
                <img :src="sectip" alt style="width: 100%;height:100%; background-size:100%;" />
              </div>
              <div class="ps-content">未绑定</div>
            </div>

            <div v-else>{{ cachedUserInfo.phoneNum }}</div>
            <div class="ps-left">
              <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
      </van-cell>

      <van-cell title="邮箱" is-link @click="router.push('/securitySettings/changeEmail')">
        <template #icon>
          <div class="password-style">
            <div class="ps-left" style="margin-right: 3px;">
              <img :src="secsuccess" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
        <template #right-icon>
          <div class="password-style">

            <div v-if="!cachedUserInfo.emailAddress">
          
              <div class="ps-content" style="color: red">未绑定</div>
            </div>

            <div v-else>{{ cachedUserInfo.emailAddress }}</div>
            <div class="ps-left">
              <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
      </van-cell>

      <!-- <van-cell title="谷歌验证"  is-link @click="onClickItem('googleAuth')">
        <template #icon>
          <div class="password-style">
            <div class="ps-left" style="margin-right: 3px;">
              <img :src="secwarn" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
        <template #right-icon>
          <div class="password-style">
            <div class="ps-img">
              <img :src="sectip" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
            <div class="ps-content">未绑定</div>
            <div class="ps-left">
              <img :src="lefticon" alt style="width: 100%;height:100%; background-size:100%;" />
            </div>
          </div>
        </template>
      </van-cell>-->

      <!-- <van-cell title="更改安全验证" is-link @click="onClickItem('changeSecurity')" /> -->
    </van-cell-group>
    <van-cell-group style="margin-top: 10px;">
      <van-cell title="设备" is-link @click="router.push('/securitySettings/device')"/>
    </van-cell-group>
    <!-- <van-cell-group style="margin-top: 10px;">
      <van-cell title="安全锁" is-link @click="onClickItem('securityLock')" />
    </van-cell-group>

    <van-cell-group style="margin-top: 10px;">
      <van-cell title="清除账号" value="12个月"  is-link @click="onClickItem('clearAccount')" />
    </van-cell-group>-->
  </div>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import secwarn from "@/assets/tabbar_new/my/secwarn.png";
import sectip from "@/assets/tabbar_new/my/sectip.png";
import secsuccess from "@/assets/tabbar_new/my/secsuccess.png";
import lefticon from "@/assets/tabbar_new/my/lefticon.png";
const router = useRouter();
const cachedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

const loginPassword = ref({
  status: "未设置"
});

const phoneNumber = ref({
  status: "未绑定"
});

const email = ref({
  verified: true,
  label: "p******n@163.COM"
});

const googleAuth = ref({
  status: "未绑定"
});

function onBack() {
  router.back();
}

function onClickItem(key: string) {
  // 模拟点击事件，这里可以根据key跳转或弹窗等
  // 例如 router.push(`/security/${key}`)
  alert(`点击了 ${key}`);
}
</script>
  
  <style scoped lang="scss">
.password-style {
  display: flex;
  align-items: center;
}
.ps-img {
  width: 8px;
  height: 8px;
  margin-right: 12px;
}
.ps-content {
  font-size: 12px;
  color: #8a8a8d;
  margin-right: 6px;
}
.ps-left {
  width: 12px;
  height: 12px;
}
/* Vant Cell 组件自带样式，只需要针对图标颜色做调整 */
/* 这里不要修改太多基础样式，否则破坏 vant 结构 */
</style>
  