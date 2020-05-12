import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '../internationalisation/en.json'
import hi from '../internationalisation/hi.json'
Vue.use(VueI18n);

const messages = {
    'en': {
        ...en
    },
    'hi': {
        ...hi
    }
};

Object.defineProperty(Vue.prototype, '$locale', {
    get: function () {
      return i18n.locale
    },
    set: function (locale) {
      i18n.locale = locale
    }
  })

const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'hi', // set fallback locale
    messages, // set locale messages
});

export default i18n;
