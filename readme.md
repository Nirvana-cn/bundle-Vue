## Webpack 4 打包 Vue 文件

在不使用vue-cli脚手架工具的情况下，如何配置webpack来对vue文件进行打包编译

使用webpack打包vue文件，除了需要引入vue-loader以外，还需要确定vue的构建版本！！！

仔细阅读vuejs官网-教程-安装-命令行工具那一块

https://cn.vuejs.org/v2/guide/installation.html

官网已经说明了在NPM包的dist/目录下有很多不同的Vue.js构建版本。

而使用哪一个构建版本取决去你引入vue的方式。我是使用ES6规范引入vue的，即使用import语法导入vue模块，所以需要将vue的构建版本设置为vue.esm.js。

如果你使用commonjs规范引入vue，即使用require语法导入vue模块，那么就需要vue的构建版本设置为vue.commonjs.js。


```
const webpack=require('webpack');

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
                test:/\.vue$/,
                use:'vue-loader'
            }
        ]
    },
    // 还需要添加以下内容
    resolve: {
        alias: {
            //确定vue的构建版本
            'vue$':'vue/dist/vue.esm.js'
        },
        extensions: ['*','.js','.vue','.json']
    }
}
```

#### ** resolve.alias简介
 
resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径。例如使用以下配置：
```
// Webpack alias 配置
resolve:{
  alias:{
    components: './src/components/'
  }
}
```
当你通过 import Button from 'components/button' 导入时，实际上被 alias 等价替换成了 import Button from './src/components/button'。

以上 alias 配置的含义是把导入语句里的 components 关键字替换成 ./src/components/。

alias 还支持 $ 符号来缩小范围到只命中以关键字结尾的导入语句：

```
resolve:{
  alias:{
    'react$': '/path/to/react.min.js'
  }
}
```

react$ 只会命中以 react 结尾的导入语句，即只会把 import 'react' 关键字替换成 import '/path/to/react.min.js'。


## Webpack 4 的一些注意点

1. webpack4抽离出了webpack-cli，所以我们需要下载2个依赖

```
npm install webpack webpack-cli -D
```

2. Mode webpack需要设置mode属性，可选 development 或 production

development模式特性:

- a.浏览器调试工具
- b.注释、开发阶段的详细错误日志和提示
- c.快速和优化的增量构建机制

production模式特性:

- a.开启所有的优化代码
- b.更小的bundle大小
- c.去除掉只在开发阶段运行的代码
- d.Scope hoisting和Tree-shaking

```
"scripts": {
    "start": "webpack --mode development",
    "server": "webpack-dev-server --open --mode development"
}
```
3. 配置loader
- test: 一个正则表达式，匹配文件名
- use: 一个数组，里面放需要执行的loader，倒序执行，从右至左。
- exclude: 取消匹配node_modules里面的文件
```
{
  test:/\.styl$/,
  use:['style-loader','css-loader','stylus-loader'],
  exclude: /node_modules/             
}
```