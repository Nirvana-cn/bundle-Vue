<template>
    <div>
        <p>page 1</p>
        <div>
            <router-link to="/page1/child1">get child 1</router-link>
            <router-link to="/page1/child2">get child 2</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>