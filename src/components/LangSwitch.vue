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
    <select class="btn btn-dark mb-1" v-model="locale">
        <option value="zh">中文</option>
        <option value="en">English</option>
    </select>
</template>
