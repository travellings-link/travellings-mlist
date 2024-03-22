<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { tagColor, api } from '@/utils';
import Modal from './Modal.vue';

const isOpen = defineModel();
const toast = useToast();
const loading = ref(false);
const adding = ref(false);
const emit = defineEmits(["getData"]);
const { t } = useI18n({
    messages: {
        zh: {
            oneClickAdd: "一键添加",
            websiteName: "网站名称",
            websiteLink: "网站链接",
            addAll: "一键添加",
            cancel: "取消",
            noData: "暂无数据",
            addSuccess: "添加成功，这些 Issues 已经被自动关闭啦！",
            oneClickAddInfo: "以下为包含 “审核通过” Tag 的 OPEN Issues，添加成功后这些 Issues 将会被自动关闭",
            loading: "正在从 Github 获取数据..."
        },
        en: {
            oneClickAdd: "One-click Add",
            websiteName: "Website Name",
            websiteLink: "Website Link",
            addAll: "Add All",
            cancel: "Cancel",
            noData: "No Data",
            addSuccess: "Added successfully, these Issues have been automatically closed!",
            oneClickAddInfo: "The following are OPEN Issues containing the '审核通过' Tag. After successful addition, these Issues will be automatically closed.",
            loading: "Getting data from Github..."
        }
    }
});
const issuesApi = async () => {
    const timestamp = new Date().getTime();
    const res = await fetch("https://api.github.com/repos/travellings-link/travellings/issues?labels=审核通过&_t=" + timestamp);
    return await res.json();
}

const websites = ref([]);
const getIssues = async () => {
    loading.value = true;

    const res = await issuesApi();

    websites.value = res.map(item => {
        const body = item.body;
        const websiteData = body.split("\n");
        const websiteName = websiteData[2];
        const websiteLink = websiteData[6];
        const issuesID = item.number;
        return {
            name: websiteName,
            link: websiteLink,
            status: "RUN",
            tag: "go",
            issuesId: issuesID
        };
    });

    loading.value = false;
}

const addAll = async () => {
    adding.value = true;
    

    const res = await api('/action/add', "POST", toast, websites.value);
    if (res) {
        emit("getData");
        toast.success(t("addSuccess"));
        isOpen.value = false;
    }
    adding.value = false;
};

watch(isOpen, (val) => {
    if (val) {
        getIssues();
    }
});


</script>

<template>
    <Modal v-model="isOpen">

        <h4 class="modal-title"> {{ t("oneClickAdd") }} </h4>

        <div>{{ t("oneClickAddInfo") }}</div>
        <table class="table mt-3">
            <thead>
                <th>ID</th>
                <th>{{ t("websiteName") }}</th>
                <th>{{ t("websiteLink") }}</th>
            </thead>
            <tbody>
                <template v-if="loading">
                    <tr>
                        <td colspan="6" class="text-center">
                            <span class="spinner-border spinner-border-sm"></span>
                            {{ t("loading") }}
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <template v-if="websites.length > 0">
                        <tr v-for="item in websites">
                            <td>#{{ item.issuesId }}</td>
                            <td>{{ item.name }}</td>
                            <td><a :href="item.link" target="_blank">{{ item.link }}</a></td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="6" class="text-center">
                            <i class="fa fa-minus-circle"></i>
                            {{ t("noData") }}
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

        <button class="btn btn-success" @click="addAll" :disabled="adding">
            <span class="spinner-border spinner-border-sm" v-if="adding"></span>
            {{ t("addAll") }}
        </button>
        <button type="button" class="btn btn-secondary" @click="isOpen = false">{{ t("cancel") }}</button>
    </Modal>
</template>
