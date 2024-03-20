<script setup>
import { api } from '@/utils.js';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const loading = ref(false);
const toast = useToast();
const listData = ref([]);
const getData = async () => {
    loading.value = true;
    listData.value = await api("/all", "GET", toast);
    loading.value = false;
};
const list = computed(() => {
    return listData.value;
});
const statusIcon = {
    'LOST': 'exclamation-triangle',
    'WAIT': 'clock-o',
    'RUN': 'check-circle',
    'OTHER': 'times-circle'
};
const statusColor = {
    'LOST': 'warning',
    'WAIT': 'info',
    'RUN': 'success',
    'OTHER': 'danger'
};
const getStatusIcon = status => {
    const icon = statusIcon[status] || statusIcon['OTHER'];
    return `fa-${icon}`;
};
const getStatusColor = status => {
    const color = statusColor[status] || statusColor['OTHER'];
    return `text-${color}`;
};

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
                <tr v-for="(item, index) in list" :key="item.id">
                    <td v-tooltip="item.status">{{ item.id }}</td>
                    <td>
                        {{ item.name }}
                        <i :class="['fa', getStatusIcon(item.status), getStatusColor(item.status)]"
                            v-tooltip="item.failedReason"></i>
                    </td>
                    <td><a :href="item.url" target="_blank">{{ item.url.replace('https://', '') }}</a></td>
                    <td class="pcOnly"><span v-tooltip="item.failedReason">{{ item.status }}</span></td>
                    <td class="pcOnly">
                        <!-- <span v-for="(tag, tagIndex) in item.tag.split(',')" :key="tagIndex"
                            :class="['badge', `badge-${tagColor[tag] || 'secondary'}`]" v-if="tag !== 'go'">{{ tag
                            }}</span> -->
                    </td>
                    <td>
                        <a href="javascript:;" class="adminOnly" @click="editItem(item.id)"><i
                                class="fa fa-edit"></i></a>
                        <a href="javascript:;" class="adminOnly" @click="del(item.id)"><i class="fa fa-trash"></i></a>
                        <a href="javascript:;" @click="reportItem(item.id)" v-tooltip="'举报网站'"><i
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
</template>
