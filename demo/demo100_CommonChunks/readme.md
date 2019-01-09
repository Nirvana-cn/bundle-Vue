## 提取公共模块:

### 针对多页面应用

打包的过程中有多个入口文件才有提取公共代码的必要，否则不存在提取公共代码的需求，直接打包到一个文件里就可以了。

输出的时候生成`.bunle.js`文件和`.chunk.js`文件。

```javascript
entry:{
    pageA: './src/pageA.js',
    pageB: './src/pageB.js'
},
output: {
    path:path.resolve(__dirname,'build'),
    filename:'[name].bundle.js',
    chunkFilename:'[name].chunk.js'
}
```

### 分离公共代码的方法

webpack4内置了提取公共代码的配置，用来分离公共代码和共用的第三方模块，`chunks`用来选择需要抽取公共代码的入口文件(chunk)，一般优先分离公共模块，然后再提取自己代码中的共用代码，因此`vendor`具有的优先级`priority`更高。

```javascript
optimization: {
        splitChunks: {
            cacheGroups: {
                // 自己的公共代码
                common: {
                    name: "common",
                    chunks: "all",
                    minSize: 1,
                    priority: 0
                },
                // 第三方代码
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10
                }
            }
        }
    }
```