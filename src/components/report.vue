<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { api } from '@/utils';
import Modal from './Modal.vue';


const toast = useToast();
const props = defineProps({
    reportId: {
        type: Number,
        required: true
    }
});


const loading = ref(false);
const isOpen = defineModel();

const { t } = useI18n({
    messages: {
        zh: {
            "reportSite": "举报网站",
            "reportType": "举报类型",
            "selectType": "请选择举报类型",
            "reportInfo": "如果您发现此网站不再符合开往的 {link}， 可以在此举报，我们会尽快处理。",
            "verificationStandard": "审核标准",
            "contentViolation": "内容违规",
            "illegalContent": "该网站现在存在违法违规内容",
            "linkViolation": "开往链接违规",
            "lostButExist": "该网站的巡查状态非LOST，但是未找到开往链接/徽标",
            "pcMenu": "该网站的开往链接放置在PC端默认收起的菜单中，难以发现",
            "noMobile": "该网站的PC端有开往链接，但移动端未找到",
            "serverDomain": "服务器/域名问题",
            "runButFail": "该网站的巡查状态为RUN，但是无法正常访问",
            "other": "其他",
            "comment": "备注说明",
            "contact": "联系方式",
            "submit": "提交",
            "cancel": "取消",
            "commentPlaceholder": "请输入其他举报理由",
            "contactPlaceholder": "请输入您的邮箱，以便后续联系",
            "reportSuccess": "举报成功，我们会尽快处理，感谢您的反馈！",
            "canNotSubmit": "请填写完整信息后提交"
        },
        en: {
            "reportSite": "Report Website",
            "reportType": "Report Type",
            "selectType": "Please select the type of report",
            "reportInfo": "If you find that this site no longer meets the {link} of Travelling, you can report it here, and we will deal with it as soon as possible.",
            "verificationStandard": "Verification Standard",
            "contentViolation": "Content Violation",
            "illegalContent": "The site now contains illegal content",
            "linkViolation": "Link Violation",
            "lostButExist": "The site's inspection status is not LOST, but the link/logo is not found",
            "pcMenu": "The site's link is placed in the PC default menu, which is difficult to find",
            "noMobile": "The site has a link in the PC end, but not found in the mobile end",
            "serverDomain": "Server/Domain Issue",
            "runButFail": "The site's inspection status is RUN, but it cannot be accessed normally",
            "other": "Other",
            "comment": "Comment",
            "contact": "Contact",
            "submit": "Submit",
            "cancel": "Cancel",
            "commentPlaceholder": "Please enter other reporting reasons",
            "contactPlaceholder": "Please enter your email for follow-up contact",
            "reportSuccess": "Reported successfully, we will deal with it as soon as possible, thank you for your feedback!",
            "canNotSubmit": "Please fill in the complete information before submitting"
        }
    }
})

const turnstileLoaded = ref(false);
const vktoken = ref(null);
const turnstileID = ref(null);

const id = ref(0);
const reasonSel = ref("null");
const reasonDetail = ref("")
const contact = ref("")

watch(() => props.reportId, newVal => {
    id.value = newVal;
});

window.onloadTurnstileCallback = () => {
    turnstileID.value = turnstile.render('#check', {
        sitekey: '0x4AAAAAAARuWQIjaC-Tm8-m',
        callback: n => {
            vktoken.value = n;
        },
    });
    console.log(`Turnstile loaded: ${turnstileID.value}`);
};

const loadTurnstile = () => {
    if (turnstileLoaded.value) return;
    turnstileLoaded.value = true;

    const TURNSTILE_JS = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
    const script = document.createElement("script");
    script.src = TURNSTILE_JS;
    document.body.appendChild(script);
}



const report = async () => {

    const type = reasonSel.value;
    const comment = reasonDetail.value;
    const email = contact.value;
    const reason = `${type}\n${t('comment')}: ${comment}\n${t('contact')}: ${email}`;
    const data = { "id": id.value, "reason": reason, "vk": vktoken.value };

    loading.value = true;
    const res = await api("/report", "POST", toast, data);
    turnstile.reset(turnstileID);
    loading.value = false;
    if (res) {
        toast.success(t('reportSuccess'));
        isOpen.value = false;
    }
};

const canSubmit = computed(() => {
    return reasonSel.value && reasonDetail.value && contact.value && vktoken.value;
});

const submitBtnText = computed(() => {
    return canSubmit.value ? t('submit') : t('canNotSubmit');
});

watch(isOpen, newVal => {
    if (newVal) {
        loadTurnstile();
    }
});


</script>

<template>
    <Modal v-model="isOpen">

        <h4 class="modal-title">{{ t('reportSite') }} <span class="badge badge-secondary">ID: {{ id }}</span></h4>

        <i18n-t keypath="reportInfo" tag="div">
            <template #link>
                <a href="https://www.travellings.cn/docs/join">{{ t('verificationStandard') }}</a>
            </template>
        </i18n-t>


        <div class="mt-3">
            <label for="reasonSel">{{ t('reportType') }}:</label>
            <select id="reasonSel" class="form-control mb-3" v-model="reasonSel">
                <option value="null" disabled selected>{{ t('selectType') }}</option>
                <optgroup :label="t('contentViolation')">
                    <option>{{ t('illegalContent') }}</option>
                </optgroup>
                <optgroup :label="t('linkViolation')">
                    <option>{{ t('lostButExist') }}</option>
                    <option>{{ t('pcMenu') }}</option>
                    <option>{{ t('noMobile') }}</option>
                </optgroup>
                <optgroup :label="t('serverDomain')">
                    <option>{{ t('runButFail') }}</option>
                </optgroup>
                <optgroup :label="t('other')">
                    <option>{{ t('other') }}</option>
                </optgroup>
            </select>
            <label for="reason">{{ t('comment') }}:</label>
            <textarea class="form-control mb-3" :placeholder="t('commentPlaceholder')" rows="5" v-model="reasonDetail"></textarea>
            <label for="contact">{{ t('contact') }}:</label>
            <input type="email" class="form-control mb-3" :placeholder="t('contactPlaceholder')" v-model="contact">
            <div id="check"></div>

            <button class="btn btn-success mt-2" @click="report" :disabled="!canSubmit || loading">
                <span class="spinner-border spinner-border-sm" v-if="loading"></span>
                {{ submitBtnText }}
            </button>
            <button type="button" class="btn btn-secondary mt-2" @click="isOpen = false">
                {{ t('cancel') }}
            </button>
        </div>
        
    </Modal>
</template>
