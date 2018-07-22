<template>
    <div>
        <p>page 1</p>
        <p>{{count}}</p>
        <button v-on:click="increase">increment</button>
        <button v-on:click="decrease">decrement</button>
        <div>
            <router-link to="/page1/child1">get child 1</router-link>
            <router-link to="/page1/child2">get child 2</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
//    import {mapState} from 'vuex'

    export default {
        computed: {
//            ...mapState({
//                  count: state => state.count
//            })
            count () {
                return this.$store.state.count
            }
        },
        methods:{
            increase() {
                this.$store.commit('increment')
            },
            decrease() {
                this.$store.commit('decrement')
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>