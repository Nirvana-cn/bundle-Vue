## Webpack 4 打包 Vue 文件

在不使用vue-cli脚手架工具的情况下，如何配置webpack来对vue文件进行打包编译

webpack.config.js中需要如下配置，才可以打包vue文件

```
resolve: {
    alias: {
        //开发环境使用vue.esm.js',官网有说明
        'vue$': 'vue/dist/vue.esm.js'
    },
    //reuqire加载文件会自动为以下后缀的文件（如：./app.vue可以写成./app了）
    extensions: ['*', '.js', '.vue', '.json']
  }
```

一、使用 url-loader 打包图片

将图片转化成base64格式的图片，可以极大地减少请求数，因为base64是文本格式，可以直接放在body里。一般对于小于10KB大小的图片进行base64转码

优点：
- base64格式的图片是文本格式，占用内存小，转换后的大小比例大概为1/3，降低了资源服务器的消耗；
- 网页中使用base64格式的图片时，不用再请求服务器调用图片资源，减少了服务器访问次数。

缺点：
- base64格式的文本内容较多，存储在数据库中增大了数据库服务器的压力；
- 网页加载图片虽然不用访问服务器了，但因为base64格式的内容太多，所以加载网页的速度会降低，可能会影响用户的体验。

```
{
  test:/\.(png|jpe?g|gif|svg)$/,
  loader:'url-loader',
  options:{
    limit:10000
  }              
}
```

二、 使用webpack-spritesmith生成雪碧图

需要file-loader和webpack-spritesmith插件，webpack-spritesmith将目标图片打包生成一张图片，在页面中并不直接引用图片，而是通过引用webpack-spritesmith生成的类名加载图片

```
plugins: [
        new SpritesmithPlugin({
            // 需要生成雪碧图的目标图片,webpack-spritesmith会打包目标文件夹下的所有图片
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
```

#### Webpack 4 的一些注意点
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