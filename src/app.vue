<template>
    <div id="app">
        {{message}}
        <picture-loop :parameter="init"></picture-loop>
        <!--<left></left>-->
        <!--<right></right>-->
        <p>
            <router-link to="/page1">go to page 1</router-link>
            <router-link to="/page2">go to page 2</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import left from './component/left.vue'
    import right from './component/right.vue'
    import PictureLoop from './component/PictureLoop.vue'

    export default {
        name: 'app',
        data() {
            return {
                message: 'welcome vue~',
                init:{
                    images:['icon-finding-the-key','icon-hiding-the-map','icon-lets-get-out-of-here','icon-the-battle','icon-theres-the-buoy','icon-finding-the-key'],
                    width:'680',
                    height:'460'
                }
            }
        },
        components: {
            left, right, PictureLoop
        }
    }
</script>

<style scoped>

</style>