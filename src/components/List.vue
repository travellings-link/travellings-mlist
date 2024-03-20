<script setup>
import { api, getStatusColor, getTagColor, getStatusIcon } from '@/utils.js';
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'ALL'
  },
  tag: {
    type: String,
    default: 'go'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isPC: {
    type: Boolean,
    default: true
  }
});
const { t } = useI18n({
  messages: {
    zh: {
      siteName: "站点名称",
      siteLink: "站点链接",
      status: "状态",
      operation: "操作",
      statusTip: "具体含义详见官网“疑难解答”，鼠标悬停可查看部分错误信息",
      report: "举报网站",
      noData: "暂无数据",
      loading: "加载中...",
      previous: "上一页",
      next: "下一页",
      jumpToTip: "请输入要跳转的页码（1-{total}）"
    },
    en: {
      siteName: "Site Name",
      siteLink: "Site Link",
      status: "Status",
      operation: "Operation",
      statusTip: "For details, please refer to the official website's 'FAQ', and you can view some error information by hovering the mouse",
      report: "Report",
      noData: "No data",
      loading: "Loading...",
      previous: "Previous",
      next: "Next",
      jumpToTip: "Please enter the page number (1-{total})"
    }
  }
});

const loading = ref(true);
const toast = useToast();
const listData = ref([]);
const getData = async () => {
  loading.value = true;
  listData.value = await api("/all", "GET", toast);
  loading.value = false;
};
const list = computed(() => {

  const searchKeyword = props.search;
  let data = listData.value;

  if (searchKeyword) { // 启用搜索
    let kw = searchKeyword.toLowerCase();
    data = data.filter(item => {
      let itemName = item.name.toLowerCase();
      let itemUrl = item.url.toLowerCase();
      let itemId = item.id;
      return itemName.includes(kw) || itemUrl.includes(kw) || itemId == kw;
    });
  }

  const statusFilter = props.status;
  if (statusFilter != "ALL") { // 启用过滤器
    if (statusFilter == "OTHER") { // 非 RUN
      data = data.filter(item => item.status != "RUN");
    } else if (statusFilter == "4XX") { // begin with 4
      data = data.filter(item => item.status.startsWith("4"));
    } else if (statusFilter == "5XX") { // begin with 5
      data = data.filter(item => item.status.startsWith("5"));
    } else { // 其他
      data = data.filter(item => item.status == statusFilter);
    }
  }

  const tagFilter = props.tag;
  if (tagFilter != "go") { // 启用过滤器
    if (tagFilter == "go-only") { // 只显示 go
      data = data.filter(item => item.tag == "go");
    } else { // 其他
      data = data.filter(item => item.tag.includes(tagFilter));
    }
  }

  return data;
});
const curPage = ref(1);
const pageSize = ref(20);
const pagedList = computed(() => {
  const start = (curPage.value - 1) * pageSize.value;
  const end = curPage.value * pageSize.value;
  return list.value.slice(start, end);
});
const totalPage = computed(() => {
  return Math.ceil(list.value.length / pageSize.value);
});

const pageNavButtons = computed(() => {
  // 1 ... k-2 k-1 k k+1 k+2 ... n
  const buttons = [];
  const startPage = Math.max(2, curPage.value - 2);
  const endPage = Math.min(totalPage.value - 1, curPage.value + 2);
  buttons.push(1);
  if (startPage > 2) buttons.push(-1);
  for (let i = startPage; i <= endPage; i++) {
    buttons.push(i);
  }
  if (endPage < totalPage.value - 1) buttons.push(-2);
  buttons.push(totalPage.value);
  return buttons;
});

const jumpTo = () => {
  const page = parseInt(prompt(t('jumpToTip', { total: totalPage.value })));
  if (page > 0 && page <= totalPage.value) {
    curPage.value = page;
  }
};

watch(() => list.value.length, () => {
  curPage.value = 1;
});

onMounted(async () => {
  await getData()
});

defineExpose({
  getData
})

</script>

<template>
  <table class="table mt-3">
    <thead>
      <tr>
        <th>ID</th>
        <th>{{ t('siteName') }}</th>
        <th>{{ t('siteLink') }}</th>
        <Transition name="fade">
          <th v-if="isPC" v-tooltip="t('statusTip')">{{ t('status') }}</th>
        </Transition>
        <Transition name="fade">
          <th v-if="isPC">TAG</th>
        </Transition>
        <th>{{ t('operation') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loading">
        <td colspan="6" class="text-center">
          <span class="spinner-border spinner-border-sm"></span>
          {{ t('loading') }}
        </td>
      </tr>
      <template v-else>
        <tr v-for="(item, index) in pagedList" :key="item.id">
          <td v-tooltip="item.status">{{ item.id }}</td>
          <td>
            {{ item.name }}
            <i :class="['fa', getStatusIcon(item.status), getStatusColor(item.status)]"
              v-tooltip="item.failedReason"></i>
          </td>
          <td><a :href="item.url" target="_blank">{{ item.url.replace('https://', '') }}</a></td>
          <Transition name="fade">
            <td v-if="isPC"><span v-tooltip="item.failedReason">{{ item.status }}</span></td>
          </Transition>
          <Transition name="fade">
            <td v-if="isPC">
              <template v-for="tag in item.tag.split(',')">
                <span class="badge" :class="[getTagColor(tag)]" v-if="tag !== 'go'">
                  {{ tag }}
                </span>&nbsp;</template>
            </td>
          </Transition>
          <td>
            <Transition name="fade">
              <a href="javascript:;" v-if="props.isAdmin" @click="$emit('edit', item.id)"><i class="fa fa-edit"></i></a>
            </Transition>
            <Transition name="fade">
              <a href="javascript:;" v-if="props.isAdmin" @click="$emit('delete', item.id)"><i
                  class="fa fa-trash"></i></a>
            </Transition>
            <a href="javascript:;" @click="$emit('report', item.id)" v-tooltip="'举报网站'"><i class="fa fa-flag"></i></a>
          </td>
        </tr>
        <tr v-if="list.length === 0">
          <td colspan="6" class="text-center">
            <i class="fa fa-minus-circle"></i>
            {{ t('noData') }}
          </td>
        </tr>
      </template>
    </tbody>

  </table>
  <Transition>
    <div class="text-center" v-if="totalPage > 1 && !loading">
      <div class="btn-group">
        <TransitionGroup name="list">
          <button v-for="page in pageNavButtons" :key="page" class="btn"
            :class="{ 'btn-primary': curPage === page, 'btn-light': curPage !== page }" @click="curPage = page"
            :disabled="page <= 0">{{ page > 0 ? page : '...' }}</button>
        </TransitionGroup>
      </div><br>
      <div class="btn-group mt-1">
        <button class="btn btn-light" :disabled="curPage === 1" @click="curPage -= 1">
          <i class="fa fa-chevron-left"></i>
          {{ t('previous') }}
        </button>
        <button class="btn btn-light" @click="jumpTo"> {{ curPage }} / {{ totalPage }}</button>
        <button class="btn btn-light" :disabled="curPage === totalPage" @click="curPage += 1">
          {{ t('next') }}
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </Transition>
</template>
