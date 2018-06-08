import Vue from 'vue'
// const Vue = require('vue')
import VueRouter from 'vue-router'
import App from './app.vue'
import './style/reset.css'
import './style/style.styl'
import router from './router/router'
// 以内联的形式配置loader
// import Styles from 'style-loader!css-loader?modules!./reset.css';
// import Stylus from 'style-loader!css-loader!stylus-loader?modules!./style.styl';
// console.log('webpack will start')
Vue.use(VueRouter)
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
let app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App},
    router
})