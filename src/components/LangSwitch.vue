<script setup>
import { useI18n } from 'vue-i18n';
import { watch } from 'vue';
const { locale, t } = useI18n({
    useScope: 'global',
    messages: {
        zh: {
            title: "成员列表 {'|'} 开往",
        },
        en: {
            title: "Member List {'|'} Travellings"
        }
    }
});

watch(locale, (newVal) => {
    localStorage.setItem('t_lang', newVal);
    document.title = t(`title`);
});

const langSettings = localStorage.getItem('t_lang');
if (langSettings) {
    locale.value = langSettings;
} else {
    const navLang = navigator.language;
    if (!navLang.startsWith('zh')) {
        locale.value = 'en';
    }
}

</script>
<template>
    <div class="lang-switch">
        <div class="lang-btn" @click="locale = 'zh'" :class="{active: locale === 'zh'}">
            中文
        </div>
        <div class="lang-btn" @click="locale = 'en'" :class="{active: locale === 'en'}">
            English
        </div>
    </div>
</template>

<style scoped>
    .lang-switch {
        display: flex;
        justify-content: center;
    }
    .lang-btn {
        -webkit-user-select: none;
        user-select: none;
        margin: 0 5px;
        transition: all 0.3s;
        border-bottom: 2px solid transparent;
        font-weight: lighter;
        cursor: pointer;
    }
    .lang-btn.active {
        border-bottom-color: var(--primary);
        font-weight: bold;
    }
    .lang-btn:hover {
        color: var(--primary);
    }
</style>