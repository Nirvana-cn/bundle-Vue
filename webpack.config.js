const webpack=require('webpack');
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
    }
    // plugins: [
    //     new VueLoaderPlugin()
    // ]
}