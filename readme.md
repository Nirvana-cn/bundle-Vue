## Webpack 4 打包 Vue 文件

在不使用vue-cli脚手架工具的情况下，如何配置webpack来对vue文件进行打包编译

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