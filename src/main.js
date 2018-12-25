import Vue from 'vue'
// const Vue = require('vue')
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './app.vue'
import './style/reset.css'
import './style/style.styl'
import router from './router/router'
import store from './state/state'

// 以内联的形式配置loader
// import Styles from 'style-loader!css-loader?modules!./reset.css';
// import Stylus from 'style-loader!css-loader!stylus-loader?modules!./style.styl';
// console.log('webpack will start')
Vue.use(VueRouter)
Vue.use(Vuex)

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
let app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    router,
    store
})
console.log(aa)