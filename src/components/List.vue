<script setup>
import { api, getStatusColor, getTagColor, getStatusIcon } from '@/utils.js';
import { ref, onMounted, computed } from 'vue';
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
    }
});
const loading = ref(false);
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
        data = listData.filter(item => {
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
const pageSize = ref(10);
const pagedList = computed(() => {
    const start = (curPage.value - 1) * 10;
    const end = curPage.value * 10;
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



onMounted(async () => {
    await getData()
});
</script>

<template>
    <table class="table mt-3">
        <thead>
            <tr>
                <th>ID</th>
                <th>站点名称</th>
                <th>站点链接</th>
                <th class="pcOnly" data-toggle="tooltip" title="具体含义详见官网“疑难解答”，鼠标悬停可查看部分错误信息">状态</th>
                <th class="pcOnly">TAG</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <template v-if="loading">
                <tr>
                    <td colspan="6" class="text-center">
                        <span class="spinner-border spinner-border-sm"></span>
                        加载中...
                    </td>
                </tr>
            </template>
            <template v-else>
                <tr v-for="(item, index) in pagedList" :key="item.id">
                    <td v-tooltip="item.status">{{ item.id }}</td>
                    <td>
                        {{ item.name }}
                        <i :class="['fa', getStatusIcon(item.status), getStatusColor(item.status)]"
                            v-tooltip="item.failedReason"></i>
                    </td>
                    <td><a :href="item.url" target="_blank">{{ item.url.replace('https://', '') }}</a></td>
                    <td class="pcOnly"><span v-tooltip="item.failedReason">{{ item.status }}</span></td>
                    <td class="pcOnly">
                        <template v-for="tag in item.tag.split(',')">
                            <span class="badge" :class="[getTagColor(tag)]" v-if="tag !== 'go'">
                                {{ tag }}
                            </span>&nbsp;</template>
                    </td>
                    <td>
                        <a href="javascript:;" class="adminOnly" @click="$emit('edit', item.id)"><i
                                class="fa fa-edit"></i></a>
                        <a href="javascript:;" class="adminOnly" @click="$emit('delete', item.id)"><i
                                class="fa fa-trash"></i></a>
                        <a href="javascript:;" @click="$emit('report', item.id)" v-tooltip="'举报网站'"><i
                                class="fa fa-flag"></i></a>
                    </td>
                </tr>
                <tr v-if="list.length === 0">
                    <td colspan="6" class="text-center">
                        <i class="fa fa-minus-circle"></i>
                        暂无数据
                    </td>
                </tr>
            </template>
        </tbody>

    </table>
    <div class="text-center">
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
                上一页
            </button>
            <button class="btn btn-light" @click="jumpTo"> {{ curPage }} / {{ totalPage }}</button>
            <button class="btn btn-light" :disabled="curPage === totalPage" @click="curPage += 1">
                下一页
                <i class="fa fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>
