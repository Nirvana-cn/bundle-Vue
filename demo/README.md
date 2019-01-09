# 代码分离

## 意义和应用场景

代码分离是 `webpack` 中最引人注目的特性之一。此特性能够把代码分离到不同的 `bundle` 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 `bundle`，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

> 分离业务代码 和 第三方依赖

> 分离业务代码 和 业务公共代码 和 第三方依赖

> 分离首次加载 和 访问后加载的代码 (用于首屏加载)

## 常用方法

### 1. 提取公共模块(防止重复)

#### 针对多页面应用

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

#### 分离公共代码

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

### 2. 动态导入

当涉及到动态代码拆分时，`webpack` 提供了两个类似的技术。对于动态导入，第一种，也是推荐选择的方式是，使用符合 `ECMAScript` 提案的 `import()` 语法。第二种，则是使用 `webpack` 特定的 `require.ensure`。


现在，不再使用静态导入 `lodash`，而是通过使用动态导入来分离一个 `chunk`：

```javascript
function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
        var element = document.createElement('div');
        var _ = _.default;
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
        return element;
    }).catch(error => 'An error occurred while loading the component');
}
getComponent().then(component => {
    document.body.appendChild(component);
})
```

注意：在注释中使用了 `webpackChunkName`。这样做会导致我们的 `bundle` 被命名为 `lodash.bundle.js`。

### 3.懒加载




