### 常用loader以及plugin

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

三、多入口文件配置
多个入口可以有两种实现方式进行打包

- 一种是没有关系的但是要打包到一起去的，可以写一个数组，实现多个文件打包
- 另一种就是每一个文件都单独打包成一个文件的

下面就来看看这两种方式的写法
```
let path = require('path');

module.exports = {
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        filename: '[name].js',      // 打包后会生成index.js和login.js文件
        path: path.resolve('dist')
    }
}
```
四、多页面打包

如果开发的时候不只一个页面，我们需要配置多页面，html-webpack-plugin插件自有办法

```
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 多页面开发，怎么配置多页面
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    // 出口文件
    output: {
        filename: '[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']   // 对应关系,index.js对应的是index.html
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['login']   // 对应关系,login.js对应的是login.html
        })
    ]
}
```

五、拆分css
extract-text-webpack-plugin插件会将打包到js里的css文件进行一个拆分
```
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filaneme: 'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/style.css')
    ]
}
```

六、热更新

在配置devServer的时候，如果hot为true，就代表开启了热更新

But这并没那么简单，因为热更新还需要配置一个webpack自带的插件并且还要在主要js文件里检查是否有module.hot

```
// webpack.config.js
let webpack = require('webpack');

module.exports = {
    plugins: [
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 3000
    }
}

// 此时还没完虽然配置了插件和开启了热更新，但实际上并不会生效

// index.js
let a = 'hello world';
document.body.innerHTML = a;
console.log('这是webpack打包的入口文件');

// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
```

热更新的好处可能在vue或者react中有更大的发挥，其中某一个组件被修改的时候就会针对这个组件进行热更新了

七、reslove解析

在webpack的配置中，resolve我们常用来配置别名和省略后缀名

```
module.exports = {
    resolve: {
        // 别名
        alias: {
            $: './src/jquery.js'
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
}
```

八、指定webpack配置文件

在package.json的脚步里，我们可以配置调用不同的webpack配置文件进行打包

```
"scripts": {
    "start": "webpack --config webpack.config.vue.js"
  }
```

九、提取公共代码

在webpack4之前，提取公共代码都是通过一个叫CommonsChunkPlugin的插件来办到的。到了4以后，内置了一个一模一样的功能，而且起了一个好听的名字叫“优化”,[配置细节看官方文档](https://webpack.js.org/plugins/split-chunks-plugin/#defaults)

```
// 假设a.js和b.js都同时引入了jquery.js和一个写好的utils.js
// a.js和b.js
import $ from 'jquery';
import {sum} from 'utils';
```

那么他们两个js中其中公共部分的代码就是jquery和utils里的代码了

```
module.exports = {
    entry: {
        a: './src/a.js',
        b: './src/b.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dust')
    },
    // 提取公共代码
+   optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
+   },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'a.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'a']
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'b']
        })
    ]
}
```
Webpack3内置了专门用于提取多个 Chunk 中公共部分的插件 CommonsChunkPlugin，CommonsChunkPlugin 大致使用方法如下：

```
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

entry:{
  pageA:'./pageA.js',
  pageB:'./pageB.js'
},
plugins:[
    new CommonsChunkPlugin({
      // 从哪些 Chunk 中提取
      chunks: ['pageA', 'pageB'],
      // 提取出的公共部分形成一个新的 Chunk，这个新 Chunk 的名称
      name: 'common'
    })
]
```

十、HTML压缩

使用html-webpack-plugin 自动化注入JS、CSS打包HTML文件时，很少会为其添加配置项，直接复制样例配置就行。

```
new HtmlWebpackPlugin({
            template: __dirname + '/views/index.html',
            filename: '../index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            chunksSortMode: 'dependency'
        })
```

十一、JS压缩

webpack 4 可以通过 "mode" 配置选项轻松切换到压缩输出，只需设置为 "production",也可以在命令行接口中使用 --optimize-minimize 标记， webpack 会内部调用 UglifyJSPlugin。

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
    },
  mode: "production"
};
```
也可以在配置将optimization.minimize设置为true。
```
module.exports={
    entry:'./src/main.js',
    output: {
        filename: "bundle.js",
        path:path.resolve('public')
    },
    optimization:{
        minimize:true
    }
}
```

十二、noParse

noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

noParse 是可选配置项，类型需要是 RegExp、[RegExp]、function 其中一个。

例如想要忽略掉 jQuery 、ChartJS，可以使用如下代码：

```
module: {
  // 使用正则表达式
  noParse: /jquery|chartjs/

  // 使用函数，从 Webpack 3.0.0 开始支持
  noParse: (content)=> {
    // content 代表一个模块的文件路径
    // 返回 true or false
    return /jquery|chartjs/.test(content);
  }
}
```

十三、tree shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。

为了学会使用 tree shaking，你必须……

- 使用 ES2015 模块语法（即 import 和 export）。
- 在项目 package.json 文件中，添加一个 "sideEffects" 入口。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin——生产环境中将自动调用UglifyJSPlugin删除冗余的代码段）。
