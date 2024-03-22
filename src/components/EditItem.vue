<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { tagColor, api } from '@/utils';
import Modal from './Modal.vue';

const toast = useToast();
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(["getData"]);
const id = ref(0);
const name = ref("");
const url = ref("");
const tag = ref("");
const status = ref("");
watch(() => props.item, (val) => {
    id.value = val.id;
    name.value = val.name;
    url.value = val.url;
    tag.value = val.tag;
    status.value = val.status;
}, { immediate: true });

const isOpen = defineModel();

const { t } = useI18n({
    messages: {
        zh: {
            websiteName: "网站名称",
            websiteNamePlaceholder: "请输入网站名称",
            websiteLink: "网站链接",
            websiteLinkPlaceholder: "请输入网站链接",
            status: "状态",
            submit: "提交",
            cancel: "取消",
            spinner: "更新中...",
            tag: "TAG",
            tagPlaceholder: "请输入TAG",
            editItem: "编辑网站",
            run: "正常 (RUN)",
            lost: "网址存活，但无开往徽标 (LOST)",
            error: "网址异常 (ERROR)",
            timeout: "连接超时 (TIMEOUT)",
            wait: "等待处理 (WAIT)",
            selectTag: "点击添加TAG",
        },
        en: {
            websiteName: "Website Name",
            websiteNamePlaceholder: "Enter website name",
            websiteLink: "Website Link",
            websiteLinkPlaceholder: "Enter website link",
            status: "Status",
            submit: "Submit",
            cancel: "Cancel",
            spinner: "Updating...",
            tag: "TAG",
            tagPlaceholder: "Enter TAG",
            editItem: "Edit Item",
            run: "OK (RUN)",
            lost: "Site is alive, but no badge (LOST)",
            error: "Site is abnormal (ERROR)",
            timeout: "Connection timeout (TIMEOUT)",
            wait: "Waiting for processing (WAIT)",
            selectTag: "Click to add TAG",
        }
    }
});

const loading = ref(false);

const tagList = computed(() => {
    return tag.value.split(",");
});

const addTag = newTag => {
    tag.value = tag.value + "," + newTag;
};

const tagSelList = computed(() => {
    const tags = [];
    for (let tag in tagColor) {
        if (tagList.value.includes(tag)) {
            continue;
        }
        const color = tagColor[tag];
        tags.push({ tag, color });
    }
    return tags;
});

const submit = async () => {
    loading.value = true;
    // let res = await jsonPost(`https://api.travellings.cn/action/edit`, {id, name, link, tag, status });
    const res = await api("/action/edit", "POST", toast, {
        id: id.value,
        name: name.value,
        link: url.value,
        tag: tag.value,
        status: status.value
    });
    loading.value = false;
    if (res) {
        isOpen.value = false;
        emit("getData");
    }
}


</script>

<template>
    <Modal v-model="isOpen">
        <h4 class="modal-title">{{ t('editItem') }} <span class="badge badge-secondary">ID: <span> {{ id
                    }}</span></span></h4>

        <div class="mt-3">
            <label for="websiteName">{{ t('websiteName') }}:</label>
            <input type="text" class="form-control mb-3" id="websiteName" v-model="name"
                :placeholder="t('websiteNamePlaceholder')">
            <label for="websiteLink">{{ t('websiteLink') }}:</label>
            <input type="url" class="form-control mb-3" v-model="url" :placeholder="t('websiteLinkPlaceholder')">
            <div class="row">
                <div class="col-6">
                    <label for="status">{{ t('status') }}:</label>
                    <select class="form-control mb-3" v-model="status">
                        <option value="RUN">{{ t('run') }}</option>
                        <option value="LOST">{{ t('lost') }}</option>
                        <option value="ERROR">{{ t('error') }}</option>
                        <option value="TIMEOUT">{{ t('timeout') }}</option>
                        <option value="WAIT">{{ t('wait') }}</option>
                        <option value="400">400 Bad Request</option>
                        <option value="403">403 Forbidden</option>
                        <option value="404">404 Not Found</option>
                        <option value="405">405 Method Not Allowed</option>
                        <option value="418">418 I'm a teapot</option>
                        <option value="429">429 Too Many Requests</option>
                        <option value="500">500 Internal Server Error</option>
                        <option value="501">501 Not Implemented</option>
                        <option value="502">502 Bad Gateway</option>
                        <option value="503">503 Service Unavailable</option>
                        <option value="504">504 Gateway Timeout</option>
                    </select>
                </div>
                <div class="col-6">
                    <label for="tag">TAG:</label>
                    <input type="text" class="form-control mb-3" v-model="tag" :placeholder="t('tagPlaceholder')"
                        value="go">
                </div>
            </div>
            <div id="tagSel" class="mb-3">
                {{ t('selectTag') }}:
                <TransitionGroup name="tag-list">
                    <span v-for="tag in tagSelList" :key="tag.tag" class="tags">
                        <span :class="`badge badge-${tag.color}`" @click="addTag(tag.tag)">{{ tag.tag }}</span>&nbsp;
                    </span>
                </TransitionGroup>
            </div>
        </div>
        <button class="btn btn-primary" @click="submit">
            <span class="spinner-border spinner-border-sm" v-if="loading"></span>
            {{ t('submit') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="isOpen = false">
            {{ t('cancel') }}
        </button>
    </Modal>
</template>

<style scoped>
.tags {
    display: inline-block;
}
.tag-list-enter-active,
.tag-list-leave-active,
.tag-list-move {
    transition: all 0.3s;
}
.tag-list-enter-from, .tag-list-leave-to {
    opacity: 0;
    transform: translate(50px, -50px);
}
.tag-list-leave-active {
    position: absolute;
}

</style>
