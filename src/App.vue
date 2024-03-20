<script setup>
import List from './components/List.vue';
import LangSwitch from './components/LangSwitch.vue';
import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted } from 'vue';
const { t } = useI18n({
  messages: {
    zh: {
      memberList: '成员列表',
      searchPlaceholder: '键入 名称/链接/ID 以搜索...',
      applyJoin: '申请加入',
      officialSite: '官网',
      travelling: '开往',
      refresh: '刷新',
      allSites: '全部站点',
      notRun: '非 RUN',
      filterTip: '筛选网站（搜索结果也会被筛选）',
      allTags: '全部类型',
      blog: '博客',
      normalSite: '杂项',
      techSite: '技术类',
      siteSharing: '网站分享类',
      life: '生活类',
      hybrid: '综合类',
      uncategorized: '未分类',
      fastAdd: '一键添加',
      logoutTip: '点击退出登录',
      sourceCode: '源代码'
    },
    en: {
      memberList: 'Member List',
      searchPlaceholder: 'Type name/link/ID to search...',
      applyJoin: 'Apply to Join',
      officialSite: 'Official Website',
      travelling: 'Travelling',
      refresh: 'Refresh',
      allSites: 'All Sites',
      notRun: 'Not RUN',
      filterTip: 'Filter sites (search results will be filtered too)',
      allTags: 'All Tags',
      blog: 'Blog',
      normalSite: 'Normal',
      techSite: 'Tech',
      siteSharing: 'Site',
      life: 'Life',
      hybrid: 'Hybrid',
      uncategorized: 'Untagged',
      fastAdd: 'Sync from GitHub',
      logoutTip: 'Click to logout',
      sourceCode: 'Source Code'
    }
  }
});

const isAdmin = ref(false);
const isPC = ref(
  window.innerWidth > 768
);

const search = ref('');
const status = ref('ALL');
const tag = ref('go');
const mlist = ref(null);

const onResize = () => {
  isPC.value = window.innerWidth > 768;
};
onMounted(() => {
  window.addEventListener('resize', onResize);
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
})

</script>

<template>
  <div class="container mt-4 mb-4">
    <div class="main p-3">
      <div class="row">
        <div class="col-4">
          <h3 id="mainTitle">{{ t('memberList') }}</h3>
        </div>
        <div class="col-8">
          <input type="text" class="form-control" :placeholder="t('searchPlaceholder')" v-model="search" />
        </div>
      </div>
      <div class="mt-3">
        <a class="btn btn-primary mb-1" href="https://www.travellings.cn/docs/join" target="_blank"><i
            class="fa fa-user-plus"></i> {{ t('applyJoin') }}</a>
        <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/"><i class="fa fa-home"></i> {{
            t('officialSite') }}</a>
        <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/go.html" target="_blank"><i
            class="fa fa-subway"></i> {{ t('travelling') }}</a>
        <button class="btn btn-secondary mb-1" @click="mlist.getData"
          ><i class="fa fa-refresh"></i> {{ t('refresh') }}
          <span class="spinner-border spinner-border-sm" style="display: none;" id="refreshSpinner"></span>
        </button>
        <select class="btn btn-info mb-1" v-tooltip="t('filterTip')" v-model="status">
          <option value="ALL">{{ t('allSites') }}</option>
          <option value="RUN">RUN</option>
          <option value="OTHER">{{ t('notRun') }}</option>
          <option value="LOST">LOST</option>
          <option value="ERROR">ERROR</option>
          <option value="TIMEOUT">TIMEOUT</option>
          <option value="4XX">4XX</option>
          <option value="5XX">5XX</option>
          <option value="WAIT">WAIT</option>
        </select>
        <select class="btn btn-info mb-1" v-tooltip="t('filterTip')" v-model="tag">
          <option value="go">{{ t('allTags') }}</option>
          <option value="blog">{{ t('blog') }}</option>
          <option value="normal">{{ t('normalSite') }}</option>
          <option value="tech">{{ t('techSite') }}</option>
          <option value="site">{{ t('siteSharing') }}</option>
          <option value="life">{{ t('life') }}</option>
          <option value="hybrid">{{ t('hybrid') }}</option>
          <option value="go-only">{{ t('uncategorized') }}</option>
        </select>
        <span class="adminOnly">
          <button class="btn btn-success mb-1" id="syncBtn"><i class="fa fa-plus"></i> {{ t('fastAdd') }}
            <span class="spinner-border spinner-border-sm" id="refreshIssuesSpinner" style="display: none;"></span>
          </button>
          <a class="btn btn-light mb-1" data-toggle="tooltip" title="点击退出登录" href="javascript:;" onclick="logout()"><i
              class="fa fa-user"></i> <span class="username"></span> (管理员)</a>
        </span>
        <span class="guestUserOnly" style="display: none;">
          <a class="btn btn-light mb-1" data-toggle="tooltip" title="点击退出登录" href="javascript:;" onclick="logout()"><i
              class="fa fa-user"></i> <span class="username"></span> (普通用户)</a>
        </span>
        <LangSwitch />
      </div>

      <List ref="mlist" :isPC :isAdmin :search :status :tag />
      <div class="text-center page-nav"></div>
      <div class="text-center mt-3">
        <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2023011626号-1</a> |
        <a target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35059102000048">闽公网安备35059102000048号</a> |
        Frontend by <a href="https://github.com/xuanzhi33">@xuanzhi33</a> |
        Backend by <a href="https://github.com/BLxcwg666">@BLxcwg666</a> |
        <a href="https://github.com/travellings-link/travellings-mlist" target="_blank"><i class="fa fa-github"></i> {{
            t('sourceCode') }}</a>
      </div>
    </div>
  </div>
</template>
