const webpack=require('webpack');
const path=require('path');
const SpritesmithPlugin = require('webpack-spritesmith');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports={
    entry:__dirname+'/src/main.js',
    output: {
        path:__dirname+'/public',
        filename:'bundle.js'
    },
    devtool: "none",
    devServer: {
        contentBase:'./public',
        host:'localhost',
        port:'8080',
        inline:true,
        historyApiFallback:true
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader',
                exclude: /node_modules/
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
                exclude: /node_modules/
            },
            {
                test:/\.styl$/,
                use:['style-loader','css-loader','stylus-loader'],
                exclude: /node_modules/
            },
            {
                test:/\.vue$/,
                use:'vue-loader'
            },
            {
                test:/\.(png|jpe?g|gif|svg)$/,
                loader:'url-loader',
                options:{
                    limit:10000
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$':'vue/dist/vue.esm.js'
        },
        extensions: ['*','.js','.vue','.json']
    },
    // plugins: [
    //     new VueLoaderPlugin()
    // ]
    plugins: [
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './src/static/icon'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './public/sprite.png'),
                css: path.resolve(__dirname, './public/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: './sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })
    ]
}