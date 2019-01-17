# 一、代码分离

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

** 对于按需加载或加载外部资源（如图片、文件等）来说，`output.publicPath` 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 `404` 错误，因此在使用`import()`时需要特别注意`output.publicPath`配置。

### 3.懒加载

懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

在动态导入中，虽然lodash被分离出来了，但是每次加载页面的时候都会请求它。这样做并没有对我们有很多帮助，还会对性能产生负面影响。

在实际生产中，有些模块并不需要页面加载就进行请求，因此我们可以选择将这些模块后加载，当发生特定事件时再对该模块进行请求。

```
button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    var print = module.default;
    print();
});
```

# 二、Tree shaking

## JS Tree shaking

在`webpack v4`中，只需要配置`mode`为`"production"`，即可显式激活 `UglifyjsWebpackPlugin` 插件，项目中没有使用的代码会在打包时候丢掉。

`JS` 的 `Tree Shaking` 依赖的是 `ES2015`的模块系统，因此对于第三方模块，请注意库的写法是否符合 `es` 模板系统规范。

## CSS Tree shaking

# 三、图片处理

## 图片编码

使用`url-loader`可以对图片进行`base64`编码，把图片打包到`js`文件中，减少文件请求。

```javascript
{
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
        {
            loader: "url-loader",
            options: {
                name: "[name]-[hash:5].min.[ext]",
                limit: 10000,
                publicPath: "static/",
                outputPath: "static/"
            }
        }
    ]
}
```

## 图片压缩

使用`img-loader`配合`imagemin`可以对图片进行压缩，对于不同类型的图片需要调用相应的压缩插件对图片进行处理。

```javascript
{
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
        {
            loader: "img-loader",
            options: {
                plugins: [
                    require("imagemin-pngquant")({
                        quality: "80" // the quality of zip
                    }),
                    require('imagemin-mozjpeg')({
                        quality: "30"
                    })
                ]
            }
        }
    ]
}
```

## 图片拼接

使用`postcss-loader`和`postcss-sprites`则用来合成雪碧图，雪碧图是为了减少网络请求，所以被处理雪碧图的图片多为各式各样的 `logo` 或者大小相等的小图片。而对于大图片，还是不推荐使用雪碧图。

# 四、dev-server

需要在package.json文件中编写如下配置

```
"dev": "webpack-dev-server --open"
```





