import Vue from 'vue'
import App from './app.vue'
import './style/reset.css'
import './style/style.styl'
// 以内联的形式配置loader
// import Styles from 'style-loader!css-loader?modules!./reset.css';
// import Stylus from 'style-loader!css-loader!stylus-loader?modules!./style.styl';
// console.log('webpack will start')
let app = new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})