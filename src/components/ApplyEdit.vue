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
const id = ref(0);
const name = ref("");
const url = ref("");
watch(() => props.item, (val) => {
    id.value = val.id;
    name.value = val.name;
    url.value = val.url;
});

const isOpen = defineModel();

const { t } = useI18n({
    messages: {
        zh: {
            applyEdit: "申请变更信息",
            websiteName: "原网站名称",
            websiteLink: "原网站链接",
            oldIssue: "原 Issues ID",
            issuesIdPlaceholder: "请填写之前申请加入的 Issue 的编号，便于确认身份（以#开头）",
            newName: "新网站名称",
            newNamePlaceholder: "请填写新网站名称 (不更改名称请留空)",
            newLink: "新网址",
            newLinkPlaceholder: "请填写新网址 (不更改网址请留空)",
            description: "备注",
            descriptionPlaceholder: "如有其他需求请在此处填写",
            apply: "申请",
            applying: "正在前往 GitHub，请稍等..."
        },
        en: {
            applyEdit: "Apply for Edit",
            websiteName: "Website Name (Old)",
            websiteLink: "Website Link (Old)",
            oldIssue: "Issues ID",
            issuesIdPlaceholder: "The Issue ID you've applied before (start with #)",
            newName: "New Website Name",
            newNamePlaceholder: "New website name (leave blank if no change)",
            newLink: "New Website Link",
            newLinkPlaceholder: "New website link (leave blank if no change)",
            description: "Description",
            descriptionPlaceholder: "Other requirements or descriptions",
            apply: "Apply",
            applying: "Redirecting to GitHub, please wait..."
        }
    }
});

const loading = ref(false);
const oldIssue = ref("");
const newName = ref("");
const newLink = ref("");
const description = ref("");

const submit = async () => {
    const labels = encodeURIComponent("申请变更信息");
    const title = encodeURIComponent(`申请变更：${id.value}`);
    const siteid = id.value;
    const oldissue = encodeURIComponent(oldIssue.value);
    const oldname = encodeURIComponent(name.value);
    const oldwebsite = encodeURIComponent(url.value);
    const newname = encodeURIComponent(newName.value);
    const newwebsite = encodeURIComponent(newLink.value);
    const description = encodeURIComponent(description.value);

    const url = `https://github.com/travellings-link/travellings/issues/new` +
                `?labels=${labels}`+
                `&template=update.yml&title=${title}` +
                `&siteid=${siteid}` +
                `&oldissue=${oldissue}` +
                `&oldname=${oldname}` +
                `&oldwebsite=${oldwebsite}` +
                `&name=${newname}` +
                `&newwebsite=${newwebsite}` +
                `&description=${description}`
    loading.value = true;
    toast.success(t('applying'));
    location.href = url;
}


</script>

<template>
    <Modal v-model="isOpen">
        <h4 class="modal-title">{{ t('applyEdit') }} <span class="badge badge-secondary">ID: <span> {{ id
                    }}</span></span></h4>

        <div class="mt-3">
            <label for="websiteName">{{ t('websiteName') }}:</label>
            <input type="text" class="form-control mb-3" id="websiteName" :value="name" readonly>
            <label for="websiteLink">{{ t('websiteLink') }}:</label>
            <input type="url" class="form-control mb-3" id="websiteLink" :value="url" readonly>
            <label for="oldIssue">{{ t('oldIssue') }}:</label>
            <input type="text" class="form-control mb-3" id="oldIssue" placeholder="{{ t('issuesIdPlaceholder') }}" v-model="oldIssue">
            <label for="newName">{{ t('newName') }}:</label>
            <input type="text" class="form-control mb-3" id="newName" placeholder="{{ t('newNamePlaceholder') }}" v-model="newName">
            <label for="newLink">{{ t('newLink') }}:</label>
            <input type="url" class="form-control mb-3" id="newLink" placeholder="{{ t('newLinkPlaceholder') }}" v-model="newLink">
            <label for="description">{{ t('description') }}:</label>
            <textarea class="form-control mb-3" id="description" rows="3" placeholder="{{ t('descriptionPlaceholder') }}" v-model="description"></textarea>
        </div>
        <button class="btn btn-primary" @click="submit" :disabled="loading">
            <span class="spinner-border spinner-border-sm" v-if="loading"></span>
            {{ t('apply') }}
        </button>
        <button type="button" class="btn btn-secondary" @click="isOpen = false">
            {{ t('cancel') }}
        </button>
    </Modal>
</template>


