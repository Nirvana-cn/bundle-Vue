const webpack=require('webpack');
const path=require('path');
const htmlWebapckPlugin=require('html-webpack-plugin');
const extractTextWebpackPlugin=require('extract-text-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

module.exports={
    entry:'./src/main.js',
    output: {
        path:path.resolve('public'),
        filename:'bundle.js'
    },
    mode:'development',
    devServer: {
        contentBase:'./public',
        host:'localhost',
        port:'8080',
        open:true,  //自动打开浏览器
        hot:true,   //开启热更新
        inline:true,
        historyApiFallback:true
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader',
                exclude: [
                    path.resolve('node_modules'),
                    path.resolve('src/script')
                ]
            },
            {
                test:/\.css$/,
                use:extractTextWebpackPlugin.extract({
                    use:'css-loader'
                }),
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
                    limit:1000
                }
            }
        ],
        noParse: /jquery/
    },
    resolve: {
        alias: {
            'vue$':'vue/dist/vue.esm.js'
            // 'vue$':'vue/dist/vue.common.js'
        },
        extensions: ['*','.js','.vue','.json']
    },
    plugins: [
        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve('src/static'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve('public/css/sprite.png'),
                css: path.resolve('public/css/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: './sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        }),
        new htmlWebapckPlugin({
            template:'./src/index.html',
            hash:true
        }),
        new extractTextWebpackPlugin('css/style.css'),
        new webpack.HotModuleReplacementPlugin()
    ]
}