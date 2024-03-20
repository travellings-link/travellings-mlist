import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import Toast from 'vue-toastification'
import FloatingVue from 'floating-vue'

import "vue-toastification/dist/index.css";
import 'floating-vue/dist/style.css'


import App from './App.vue'

const i18n = createI18n({
    locale: 'zh',
    legacy: false
})

const app = createApp(App);

app.use(i18n);
app.use(Toast);
app.use(FloatingVue)

app.mount('#app');
