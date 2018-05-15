<template>
    <div id="app">
        {{message}}
        <left></left>
        <right></right>
    </div>
</template>

<script type="text/ecmascript-6">
    import left from './component/left.vue'
    import right from './component/right.vue'

    export default {
        name: 'app',
        data() {
            return {
                message: 'welcome vue~'
            }
        },
        components: {
            left, right
        }
    }
</script>

<style scoped>

</style>