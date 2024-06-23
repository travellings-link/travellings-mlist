<script setup>
import List from './components/List.vue';
import LangSwitch from './components/LangSwitch.vue';
import { useI18n } from 'vue-i18n';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { api } from './utils';
import { useToast } from 'vue-toastification';
import Login from './components/Login.vue';

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
      sourceCode: '源代码',
      welcomeAdmin: '欢迎管理员 {name} 登录~',
      welcomeNormalUser: '欢迎用户 {name} 登录~',
      admin: '管理员',
      normalUser: '普通用户',
      refreshSuccess: '数据刷新成功',
      confirmLogin: '跳转到登录页面？',
      confirmLogout: '确定要退出登录？',
      logoutSuccess: '退出登录成功',
      changelog: "更新日志"
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
      sourceCode: 'Source Code',
      welcomeAdmin: 'Welcome, admin {name}~',
      welcomeNormalUser: 'Welcome, user {name}~',
      admin: 'Admin',
      normalUser: 'User',
      refreshSuccess: 'Get data successfully',
      confirmLogin: 'Go to login page?',
      confirmLogout: 'Are you sure to logout?',
      logoutSuccess: 'Logout successfully',
      changelog: "Changelog"
    }
  }
});

const toast = useToast();

const isAdmin = ref(false);
const isPC = ref(
  window.innerWidth > 768
);

const searchKeywordFromURL = new URLSearchParams(window.location.search).get('site') || '';

const search = ref(searchKeywordFromURL);
const status = ref('ALL');
const tag = ref('go');
const mlist = ref(null);
const isNormalUser = ref(false);
const username = ref('');
const onResize = () => {
  isPC.value = window.innerWidth > 768;
};

const checkUser = async () => {

  const data = await api("/user", "GET", toast);
  console.log(data);

  username.value = data.user;

  if (data.role == 0) { // 管理员
    isAdmin.value = true;
    toast.success(t('welcomeAdmin', { name: username.value }), {timeout: 1000});
  } else if (data.role == 1) { // 普通用户
    isNormalUser.value = true;
    toast.success(t('welcomeNormalUser', { name: username.value }), {timeout: 1000});
  }
}

const refresh = async () => {
  await mlist.value.getData();
  toast.success(t('refreshSuccess'));
}

onMounted(async () => {
  window.addEventListener('resize', onResize);
  await checkUser();
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
})

const isLogin = ref(false);
watch(search, newVal => {
  if (newVal == "tlogin") {
    if (!confirm(t('confirmLogin'))) {
      return;
    }

    isLogin.value = true;
  }
})

const logout = async () => {
  if (!confirm(t('confirmLogout'))) {
    return;
  }
  const res = await api("/logout", "GET", toast);
  if (res) {
    toast.success(t('logoutSuccess'));
    isAdmin.value = false;
    isNormalUser.value = false;
  }
}

const isSyncing = ref(false);
const isChangelog = ref(false);

</script>

<template>
  <div class="container mt-4 mb-4">
    <div class="main p-3">
      <div class="row">
        <div class="col-4">
          <h3 id="mainTitle">{{ t('memberList') }}</h3>
        </div>
        <div class="col-8">
          <input type="search" class="form-control" :placeholder="t('searchPlaceholder')" v-model="search" />
        </div>
      </div>
      <div class="mt-3">
        <a class="btn btn-primary mb-1" href="https://www.travellings.cn/docs/join" target="_blank"><i
            class="fa fa-user-plus"></i> {{ t('applyJoin') }}</a>
        <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/"><i class="fa fa-home"></i> {{
            t('officialSite') }}</a>
        <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/go.html" target="_blank"><i
            class="fa fa-subway"></i> {{ t('travelling') }}</a>
        <button class="btn btn-secondary mb-1" @click="refresh">
          <i class="fa fa-refresh"></i> {{ t('refresh') }}
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
        <LangSwitch />
        <Transition>
          <button class="btn btn-success mb-1" v-if="isAdmin" @click="isSyncing = true">
            <i class="fa fa-plus"></i> {{ t('fastAdd') }}
          </button>
        </Transition>
        <Transition>
          <button class="btn btn-light mb-1" v-tooltip="t('logoutTip')" v-if="isAdmin" @click="logout">
            <i class="fa fa-user"></i> {{ username }} ({{ t('admin') }})
          </button>
        </Transition>
        <Transition>
          <button class="btn btn-light mb-1" v-tooltip="t('logoutTip')" v-if="isNormalUser" @click="logout">
            <i class="fa fa-user"></i> {{ username }} ({{ t('normalUser') }})
          </button>
        </Transition>
      </div>

      <List ref="mlist" :isPC :isAdmin :search :status :tag v-model:isSyncing="isSyncing" v-model:isChangelog="isChangelog" />
      <div class="text-center page-nav"></div>
      <div class="text-center mt-3">
        <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2023011626号-1</a> |
        <a target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35059102000048">闽公网安备35059102000048号</a> |
        Frontend by <a href="https://github.com/xuanzhi33">@xuanzhi33</a> |
        Backend by <a href="https://github.com/BLxcwg666">@BLxcwg666</a> |
        <a href="https://github.com/travellings-link/travellings-mlist" target="_blank"><i class="fa fa-github"></i> {{
            t('sourceCode') }}</a> |
        <a href="javascript:;" @click="isChangelog = true"><i class="fa fa-history"></i> {{ t('changelog') }}</a>
      </div>
    </div>
  </div>
  <Login v-model="isLogin" />
</template>
