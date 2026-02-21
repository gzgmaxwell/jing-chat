<script setup lang="ts">
import router from "@/router";
import { ref, computed, watch } from "vue";
import { getTransferList } from '@/api/transfer'
import { ResCode } from '@/utils/const'
const isLogoutShow = ref(false);
const onClickLeft = () => router.back();

interface TransferRecord {
  avatar: string;
  title: string;
  time: string;
  amount: number;
  txid: string;
  type: "sent" | "received";
  date: string; // 'YYYY-MM'
}

const filterOptions = [
  { text: "全部", value: "all" },
  { text: "转出", value: "sent" },
  { text: "转入", value: "received" }
];

const filterType = ref<"all" | "sent" | "received">("all");
const searchKeyword = ref("");
const selectedMonth = ref("2025-11");
const showFilter = ref(false); // 支付方式
const showDateFilter = ref(false); //
const selectedSell = ref(""); // 售卖方式
const selectedName = ref("全部"); // 时间
const now = new Date();

const timeDate = ref(
  `${now.getFullYear()},${(now.getMonth() + 1).toString().padStart(2, "0")}`
);
console.log("object", timeDate.value.split(","));
const currentDate = timeDate.value.split(",");

const selectDate = ref(
  `${now.getFullYear()}年${(now.getMonth() + 1).toString().padStart(2, "0")}月`
);
const columnsType = ["year", "month"];
const minDate = new Date(1970, 0, 1);
const maxDate = new Date(2040, 5, 1);
// 箭头
const payArrow = computed(() => {
  return showFilter.value ? "arrow-up" : "arrow-down";
});

// 示例静态数据，真实项目请替换为接口请求数据
const records = ref([]);

const loading = ref(false);
const finished = ref(true); // 不做分页，直接设为true

// const filteredRecords = computed(() => {
//   return records.value.filter(item => {
//     // 筛选转入转出类型
//     if (filterType.value !== "all" && item.type !== filterType.value) {
//       return false;
//     }
//     // 筛选月份
//     if (item.date !== selectedMonth.value) {
//       return false;
//     }
//     // 搜索标题或者txid
//     if (
//       searchKeyword.value &&
//       !item.title.includes(searchKeyword.value) &&
//       !item.txid.includes(searchKeyword.value)
//     ) {
//       return false;
//     }
//     return true;
//   });
// });



  getTransferList().then((res) => {
    if (res.code === ResCode.SUCCESS){
      console.log("res.code",res);
      records.value = res.data
    }
  
      // showToast('转账成功')
  })

// const totalSent = computed(() =>
//   records.value
//     .filter(r => r.date === selectedMonth.value && r.viewMoney < 0)
//     .reduce((acc, cur) => acc + Math.abs(cur.viewMoney), 0)
//     .toFixed(2)
// );

// const totalReceived = computed(() =>
//   records.value
//     .filter(r => r.date === selectedMonth.value && r.viewMoney > 0)
//     .reduce((acc, cur) => acc + cur.viewMoney, 0)
//     .toFixed(2)
// );

const sellOptions = [
  { name: "全部", type: "" },
  { name: "支出", type: "1" },
  { name: "收入", type: "2" }
];

function onSearch() {
  // 触发搜索，实际业务可以重新请求接口
}

function onLoad() {
  // 处理上拉加载，示例没有分页，直接finish
  finished.value = true;
  loading.value = false;
}
function transferBtn(item) {
  selectedSell.value = item.type;
  selectedName.value = item.name;
  showFilter.value = false;
}
function onConfirmDate(selectedDate: Date) {
  console.log("确认选择的日期:", selectedDate.selectedValues);
  // 这里可以执行你想要在确认时触发的操作
  selectDate.value = ref(
    `${selectedDate.selectedValues[0]}年${selectedDate.selectedValues[1]}月`
  );
  showDateFilter.value = false;
}
</script>

<template>
  <div class="font-sans flex flex-col h-screen bg-white">
    <!-- 顶部导航 -->
    <van-nav-bar left-arrow placeholder fixed class="flex-none" @click-left="onClickLeft">
      <template #title>
        <span class="text-lg text-black font-bold">转账记录</span>
      </template>
    </van-nav-bar>

    <div class="filter-bar">
      <div class="text-12px text-sm text-[#8A8A8D] mb-4 flex gap-4 items-center">
        <span class="flex items-center" @click="showFilter = true">
          <span :class="[showFilter ? 'text-[#0256FF]' : '']">{{selectedName}}</span>
          <van-icon :color="showFilter ? '#0256FF' : ''" :name="payArrow" />
        </span>
        <span class="ml-auto flex items-center" @click="router.push('/transferComp/searchTransacte')">
          查找交易
          <van-icon name="search" />
        </span>
      </div>
    </div>

    <div class="month-summary">
      <!-- <van-dropdown-menu>
        <van-dropdown-item v-model="selectedMonth" :options="monthOptions" />
      </van-dropdown-menu>-->
      <div class="text-12px text-sm text-[#8A8A8D] flex gap-4 items-center">
        <span class="flex items-center" @click="showDateFilter = true">
          <span :class="[showDateFilter ? 'text-[#0256FF]' : '']">{{selectDate}}</span>
          <van-icon :color="showDateFilter ? '#0256FF' : ''" :name="payArrow" />
        </span>
      </div>
      <!-- <div class="summary-text">发出{{ totalSent }} GUB 收到{{ totalReceived }} GUB</div> -->
      <div class="summary-text">发出 9 GUB 收到 9 GUB</div>
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
              <div class="text-14px">转账-转给{{item.purposeNickName }}</div>
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

    <!-- <van-cell
        v-for="item in filteredRecords"
        :key="item.txid"
        :title="item.title"
        :label="item.time"
      >
        <template #right>
          <span
            :class="item.amount > 0 ? 'income' : 'expense'"
          >{{ item.amount > 0 ? '+' : '' }}{{ item.amount.toFixed(2) }}</span>
        </template>
        <template #icon>
          <van-image
            :src="item.avatar"
            width="40px"
            height="40px"
            fit="cover"
            style="border-radius: 50%"
          />
        </template>
        <template #footer>
          <div class="txid">{{ item.txid }}</div>
        </template>
    </van-cell>-->

    <!-- 买币-自选买币-售卖方式 -->
    <van-popup v-model:show="showFilter" position="bottom" round :style="{ padding: '20px' }">
      <div class="text-lg font-semibold mb-4 text-center">选择筛选项</div>
      <div class="text-gray-800 font-medium mb-2">收支类型</div>
      <div class="pb-5 flex gap-3 items-center">
        <div
          v-for="item in sellOptions"
          :key="item.type"
          class="p-2 border-2 rounded-lg bg-[#ECF1F7] flex flex-col h-15 w-103px cursor-pointer transition-colors items-center justify-center"
          :class="selectedSell === item.type ? 'border-blue-500 bg-[#FFF]' : 'border-transparent'"
          @click="transferBtn(item)"
        >
          <div class="text-sm font-medium">{{ item.name }}</div>
        </div>
      </div>
      <div class="pb-30px gap-3 grid grid-cols-2">
        <van-button color="#8A8A8D" @click="showFilter = false; selectedSell = ''; getZixuan()">取消</van-button>
        <van-button color="#0256FF" type="primary" @click="showFilter = false; getZixuan()">确认</van-button>
      </div>
    </van-popup>
    <van-popup v-model:show="showDateFilter" position="bottom" close-on-click-overlay>
      <!-- <van-date-time
        v-model:current="timeDate"
        type="year-month"
        @confirm="onConfirm"
        @cancel="onCancel"
      />-->
      <van-date-picker
        v-model="currentDate"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :columns-type="columnsType"
        @confirm="onConfirmDate"
      />
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
.filter-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #f3f8fd;
  gap: 12px;
}

.search-input {
  flex: 1;
}

.month-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #f3f8fd;
  color: #a0a0a0;
  font-size: 13px;
}

.summary-text {
  color: #999999;
  font-size: 14px;
}

// .transfer-list >>> .van-cell__right {
//   font-size: 16px;
//   font-weight: 600;
// }

.income {
  color: #f60;
}

.expense {
  color: #000;
}

.txid {
  font-size: 12px;
  color: #999;
  padding-top: 4px;
}
</style>