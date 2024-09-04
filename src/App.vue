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
      refresh: '刷新数据',
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
      changelog: "更新日志",
      travellings: "开往",
      links: "传送门",
      filter: "筛选",
      actions: "管理",
      status: "状态",
      tag: "标签"
    },
    en: {
      memberList: 'Member List',
      searchPlaceholder: 'Type name/link/ID to search...',
      applyJoin: 'Join',
      officialSite: 'Docs',
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
      changelog: "Changelog",
      travellings: "Travellings",
      links: "Links",
      filter: "Filter",
      actions: "Manage",
      status: "Status",
      tag: "Tag"
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
    toast.success(t('welcomeAdmin', { name: username.value }), { timeout: 1000 });
  } else if (data.role == 1) { // 普通用户
    isNormalUser.value = true;
    toast.success(t('welcomeNormalUser', { name: username.value }), { timeout: 1000 });
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
        <div class="col-md-6">
          <!-- <h3 id="mainTitle">{{ t('memberList') }}</h3> -->
          <h1 class="main-title">
            {{ t('travellings') }}
            <span class="sub-title">· {{ t('memberList') }}</span>
          </h1>
        </div>
        <div class="col-md-6 links">
          <a class="links-item" href="https://www.travellings.cn/docs/join" target="_blank">
            <i class="fa fa-fw fa-user-plus"></i> {{ t('applyJoin') }}</a>
          <a class="links-item" href="https://www.travellings.cn/">
            <i class="fa fa-fw fa-home"></i> {{ t('officialSite') }}</a>
          <a class="links-item" href="https://www.travellings.cn/go.html" target="_blank">
            <i class="fa fa-fw fa-subway"></i> {{ t('travelling') }}
            <i class="fa fa-angle-right"></i>
          </a>
        </div>
      </div>

      <div class="mt-3 row">
        
        <div class="col-lg-8">
          <input type="search" class="form-control" :placeholder="t('searchPlaceholder')" v-model="search" />
        </div>

        <div class="col-lg-4 action-btns mt-2 mt-lg-0">
          <div class="action-btn-container">
            <div class="menu-card filter-card">
              <div class="menu-card-title">
                <i class="fa fa-fw fa-cog"></i>
                {{ t('actions') }}
              </div>
              <div class="menu-card-items">
                <a class="menu-card-item" href="#" @click.prevent="refresh">
                  <i class="fa fa-fw fa-refresh"></i> {{ t('refresh') }}
                </a>
                <Transition>
                  <a class="menu-card-item" href="javascript:;" v-if="isAdmin" @click="isSyncing = true">
                    <i class="fa fa-fw fa-plus"></i> {{ t('fastAdd') }}
                  </a>
                </Transition>
                <Transition>
                  <a class="menu-card-item" href="javascript:;" v-tooltip="t('logoutTip')" v-if="isAdmin"
                    @click="logout">
                    <i class="fa fa-fw fa-user"></i> {{ username }} ({{ t('admin') }})
                  </a>
                </Transition>
                <Transition>
                  <a class="menu-card-item" href="javascript:;" v-tooltip="t('logoutTip')" v-if="isNormalUser"
                    @click="logout">
                    <i class="fa fa-fw fa-user"></i> {{ username }} ({{ t('normalUser') }})
                  </a>
                </Transition>
              </div>
            </div>
          </div>
          <div class="action-btn-container">
            <div class="menu-card filter-card">
              <div class="menu-card-title">
                <i class="fa fa-fw fa-filter"></i>
                {{ t('filter') }}
              </div>
              <div class="menu-card-items">
                <label for="filter-tag">
                  <i class="fa fa-fw fa-tags"></i>
                  {{ t('tag') }}
                </label>

                <select id="filter-tag" class="menu-card-item" v-tooltip="t('filterTip')" v-model="tag">
                  <option value="go">{{ t('allTags') }}</option>
                  <option value="blog">{{ t('blog') }}</option>
                  <option value="normal">{{ t('normalSite') }}</option>
                  <option value="tech">{{ t('techSite') }}</option>
                  <option value="site">{{ t('siteSharing') }}</option>
                  <option value="life">{{ t('life') }}</option>
                  <option value="hybrid">{{ t('hybrid') }}</option>
                  <option value="go-only">{{ t('uncategorized') }}</option>
                </select>

                <label for="filter-status">
                  <i class="fa fa-fw fa-info-circle"></i>
                  {{ t('status') }}
                </label>

                <select id="filter-status" class="menu-card-item" v-tooltip="t('filterTip')" v-model="status">
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
              </div>
            </div>
          </div>
        </div>

      </div>

      <List ref="mlist" :isPC :isAdmin :search :status :tag v-model:isSyncing="isSyncing"
        v-model:isChangelog="isChangelog" />

      <LangSwitch class="mt-3" />
      <div class="text-center mt-3">
        <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2023011626号-1</a> |
        <a target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35059102000048">闽公网安备35059102000048号</a>
        <br>
        Frontend by <a href="https://github.com/xuanzhi33">@xuanzhi33</a> |
        Backend by <a href="https://github.com/BLxcwg666">@BLxcwg666</a> <br>
        <a href="https://github.com/travellings-link/travellings-mlist" target="_blank"><i class="fa fa-github"></i> {{
          t('sourceCode') }}</a> |
        <a href="javascript:;" @click="isChangelog = true"><i class="fa fa-history"></i> {{ t('changelog') }}</a>
      </div>
    </div>
  </div>
  <Login v-model="isLogin" />
</template>

<style scoped>
.main-title {
  font-size: 2rem;
  font-weight: lighter;
}

.sub-title {
  font-size: 1.5rem;
  color: gray;
  font-weight: bold;
}

.action-btns {
  --card: #eee;
}

@media (prefers-color-scheme: dark) {
  .action-btns {
    --card: #333;
  }
}

.menu-card {
  background-color: var(--card);
  border-radius: 5px;
  padding: 5px 10px;

  height: 100%;
}



.menu-card-item {
  --item-bg: #daecff;
  --item-bg-hover: #c5e4ff;
  --text-color: black;
  margin: 5px 0;
  padding: 3px 10px;
  display: block;
  border: 1px solid var(--primary);
  border-radius: 5px;
  background-color: var(--item-bg);
  color: var(--primary);
  cursor: pointer;
  width: 100%;
  outline: none;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: all 0.3s;
}

.menu-card-item option {
  background-color: var(--item-bg);
  color: var(--text-color);
}

.menu-card-item:hover {
  background-color: var(--item-bg-hover);
  text-decoration: none;
}

.menu-card-items label {
  margin-top: 5px;
  margin-bottom: -3px;
  display: block;

  font-size: 0.8rem;
  color: gray;
}

@media (prefers-color-scheme: dark) {
  .menu-card-item {
    --item-bg: #283c51;
    --item-bg-hover: #1f2c3a;
    --text-color: white;
  }
}

/* @media (max-width: 768px) {
  .action-btns .col-6:nth-last-child(2) {
    padding-right: 5px;
  }
  .action-btns .col-6:last-child {
    padding-left: 5px;
  }

} */

.links {
  display: flex;
  justify-content: flex-end;

  align-items: center;
}

.links-item {
  margin-left: 10px;
  text-decoration: none;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .links {
    justify-content: flex-start;
    margin-top: 10px;
  }
}

.filter-card {
  cursor: pointer;
  position: absolute;
  right: 0;
  width: 100%;
  height: 38px;
  overflow: hidden;

  transition: all 0.3s;
}

.filter-card:hover {
  width: 240px;
  height: 160px;

  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

@media (max-width: 768px) {
  .filter-card:hover {
    width: 100%;
  }
}

.menu-card-title {
  margin-bottom: 10px;
  text-align: center;
}

.action-btns {
  display: flex;
}

.action-btn-container {
  position: relative;
  height: 38px;
  flex: 1;
}

.action-btn-container:last-child {
  margin-left: 10px;
}
</style>