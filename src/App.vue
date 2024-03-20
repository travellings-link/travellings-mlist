<script setup>
import List from './components/List.vue'
</script>

<template>
    <div class="container mt-4 mb-4">
        <div class="main p-3">
            <div class="row">
                <div class="col-4">
                    <h3 id="mainTitle">成员列表</h3>
                </div>
                <div class="col-8">
                    <input type="text" class="form-control" placeholder="键入 名称/链接/ID 以搜索..." id="searchInp">
                </div>
            </div>
            <div class="mt-3">
                <a class="btn btn-primary mb-1" href="https://www.travellings.cn/docs/join" target="_blank"><i class="fa fa-user-plus"></i> 申请加入</a>
                <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/"><i class="fa fa-home"></i> 官网</a>
                <a class="btn btn-secondary mb-1" href="https://www.travellings.cn/go.html" target="_blank"><i class="fa fa-subway"></i> 开往</a>
                <button class="btn btn-secondary mb-1" id="refreshBtn"><i class="fa fa-refresh"></i> 刷新
                    <span class="spinner-border spinner-border-sm" style="display: none;" id="refreshSpinner"></span>
                </button>
                <select class="btn btn-info mb-1" id="statusFilter" data-toggle="tooltip" title="筛选指定状态的网站，搜索结果也会被筛选">
                    <option value="ALL">全部站点</option>
                    <option value="RUN">RUN</option>
                    <option value="OTHER">非 RUN</option>
                    <option value="LOST">LOST</option>
                    <option value="ERROR">ERROR</option>
                    <option value="TIMEOUT">TIMEOUT</option>
                    <option value="4XX">4XX</option>
                    <option value="5XX">5XX</option>
                    <option value="WAIT">WAIT</option>
                </select>
                <select class="btn btn-info mb-1" id="tagFilter" data-toggle="tooltip" title="筛选指定标签的网站，搜索结果也会被筛选">
                    <option value="go">全部类型</option>
                    <option value="blog">博客</option>
                    <option value="normal">杂项</option>
                    <option value="tech">技术类</option>
                    <option value="site">网站分享类</option>
                    <option value="life">生活类</option>
                    <option value="hybrid">综合类</option>
                    <option value="go-only">未分类</option>
                </select>
                <span class="adminOnly">
                    <button class="btn btn-success mb-1" id="syncBtn"><i class="fa fa-plus"></i> 一键添加
                        <span class="spinner-border spinner-border-sm" id="refreshIssuesSpinner" style="display: none;"></span>
                    </button>
                    <a class="btn btn-light mb-1" data-toggle="tooltip" title="点击退出登录" href="javascript:;" onclick="logout()"><i class="fa fa-user"></i> <span class="username"></span> (管理员)</a>
                </span>
                <span class="guestUserOnly" style="display: none;">
                    <a class="btn btn-light mb-1" data-toggle="tooltip" title="点击退出登录" href="javascript:;" onclick="logout()"><i class="fa fa-user"></i> <span class="username"></span> (普通用户)</a>
                </span>
            </div>

            <List />
            <div class="text-center page-nav"></div>
            <div class="text-center mt-3">
                <a href="https://beian.miit.gov.cn/" target="_blank">闽ICP备2023011626号-1</a> |
                <a target="_blank"
                    href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35059102000048">闽公网安备35059102000048号</a> |
                Frontend by <a href="https://github.com/xuanzhi33">@xuanzhi33</a> |
                Backend by <a href="https://github.com/BLxcwg666">@BLxcwg666</a> |
                <a href="https://github.com/travellings-link/travellings-mlist" target="_blank"><i class="fa fa-github"></i> 源代码</a>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
