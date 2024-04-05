<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Modal from './Modal.vue';

const isOpen = defineModel();
const loading = ref(false);

const datetimeFormats = {
  en: {
    long: {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }
  },
  zh: {
    long: {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
    }
  }
}

const { t, d } = useI18n({
    datetimeFormats,
    messages: {
        zh: {
            close: "关闭",
            changelog: "更新日志",
            dataInfo: "仅显示最近的 5 条更新",
            loading: "正在从 Github 获取数据...",
            time: "时间",
            change: "Git 提交",
            commiter: "提交者",
            sha: "提交 SHA",
            seeAllFromGithub: "在 Github 查看更多"
        },
        en: {
            close: "Close",
            changelog: "Changelog",
            dataInfo: "Only show the latest 5 updates",
            loading: "Getting data from Github...",
            time: "Time",
            change: "Git Commit",
            commiter: "Commiter",
            sha: "Commit SHA",
            seeAllFromGithub: "See more on Github"
        }
    }
});
const commitsApi = async () => {
    const timestamp = new Date().getTime();
    const res = await fetch("https://api.github.com/repos/travellings-link/travellings-mlist/commits?per_page=5&_t=" + timestamp);
    return await res.json();
}


const changelogs = ref([]);
const getCommits = async () => {
    loading.value = true;

    changelogs.value = await commitsApi();

    loading.value = false;
}

const ISOToTime = ISO => {
    return new Date(ISO);
}

watch(isOpen, (val) => {
    if (val) {
        getCommits();
    }
});


</script>

<template>
    <Modal v-model="isOpen">

        <h4 class="modal-title"> {{ t("changelog") }} </h4>

        <div>{{ t("dataInfo") }}</div>
        <table class="table mt-3">
            <thead>
                <th>{{ t("time") }}</th>
                <th>{{ t("change") }}</th>
                <th>{{ t("commiter") }}</th>
            </thead>
            <tbody>
                <template v-if="loading">
                    <tr>
                        <td colspan="3" class="text-center">
                            <span class="spinner-border spinner-border-sm"></span>
                            {{ t("loading") }}
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <tr v-for="item in changelogs">
                        <td>{{ d(ISOToTime(item.commit.author.date), "long") }}</td>
                        <td>{{ item.commit.message }}</td>
                        <td>{{ item.commit.author.name }}</td>
                    </tr>
                </template>
            </tbody>
        </table>

        <button type="button" class="btn btn-secondary" @click="isOpen = false">{{ t("close") }}</button>
        <a class="btn btn-info" href="https://github.com/travellings-link/travellings-mlist/commits/main/" target="_blank">{{ t("seeAllFromGithub") }}</a>
    </Modal>
</template>
