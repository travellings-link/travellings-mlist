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
    document.title = t(`title`);
}, { immediate: true });

</script>
<template>
    <select class="btn btn-dark mb-1" v-model="locale">
        <option value="zh">中文</option>
        <option value="en">English</option>
    </select>
</template>
