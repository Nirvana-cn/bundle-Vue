<template>
    <div id="page">
        <h2>{{message}}</h2>
        <div class="container">
            <div class="wrapper">
                <div class="content">
                    <figure class="slide" v-for="pic in pictures">
                        <i :class="pic"></i>
                    </figure>
                </div>
            </div>
            <div class="time"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    var content=$('.content');

    export default {
        data() {
            return {
                message: 'This is picture loop',
                current: 1
            }
        },
        computed: {
          count() {
              return this.$props.pictures.length
          }
        },
        props:[
            'pictures'
        ],
        mounted() {
            $('.content').css('width',680 * this.count);
            setInterval(this.loop, 5000)
        },
        methods: {
            startTimeIndicator() {
                $timeIndicator.animate({
                    width: '680px'
                }, slideInterval)
            },
            loop() {
                if(this.current===6){
                    content.css({'transition':'all 0s linear','transform':'translateX(0px)'});
                    this.current = 1;
                    return;
                }
                let distance = 680 * this.current;
                content.css({'transition':'all 2s linear','transform':'translateX(-'+distance+'px)'});
                this.current++
            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper
    position: relative
    width:680px
    height:460px
    border:1px solid #000;
    overflow: hidden
    .content
        position: absolute
        height:460px
        figure
            display: inline-block
            width:680px
            height:460px
            i
                display: inline-block
</style>