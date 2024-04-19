<script setup>
import { useI18n } from 'vue-i18n';
import Modal from './Modal.vue';
import { ref } from 'vue';

const { t } = useI18n({
    messages: {
        zh: {
            login: '登录',
            loginWithGithub: '使用 GitHub 登录',
            travelling: '开往'
        },
        en: {
            login: 'Login',
            loginWithGithub: 'Login with GitHub',
            travelling: 'Travelling'
        }
    }
});

const isOpen = defineModel();
const loading = ref(false);
const login = () => {
    loading.value = true;
    location.href = "https://api.travellings.cn/login/github?redirect_url=https://list.travellings.cn/";
}

</script>

<template>
    <Modal v-model="isOpen">
        <h3>{{ t('login') }}</h3>
        <button class="btn btn-success btn-lg btn-block mt-4" @click="login" :disabled="loading">
            <i class="fa fa-github"></i> {{ t('loginWithGithub') }}
            <span class="spinner-border spinner-border-sm" v-if="loading"></span>
        </button>
        <div class="mt-3">
            &copy; {{ t('travelling') }}
        </div>
    </Modal>
</template>