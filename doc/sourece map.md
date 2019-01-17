## source map使用简介

source map 是一个存储源代码与编译代码对应位置映射的信息文件，在webpack中设置'devtool'为'source-map'时，打包之后就会生成相应的.map文件。

source map主要针对下面的问题：

1. 压缩，减小体积。比如jQuery 1.9的源码，压缩前是252KB，压缩后是32KB。
2. 多个文件合并，减少HTTP请求数。
3. 其他语言编译成JavaScript。比如CoffeeScript、TypeScript。

source map的存在是为了方便开发人员进行除错（debug），通常，JavaScript的解释器会告诉你，第几行第几列代码出错。
但是，这对于转换后的代码毫无用处，压缩代码的报错信息是很难Debug的。举例来说，jQuery 1.9压缩后只有3行，每行3万个字符，所有内部变量都改了名字，它的行号和列号已经失真。
你看着报错信息，感到毫无头绪，根本不知道它所对应的原始位置。这时就需要Source Map来还原真实的出错位置了

** 一般.map文件通过 [VLQ编码](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)由代码工具生成，所以我们会使用即可。

举例来说，我们在./src/main.js的第29行中故意打印了一个未申明变量aa，在没有source map的情况下，控制台会告诉你打包后的bundle.js文件第一行出错，
但是bundle.js只有一行啊，这种出错提示十分不友好，完全没办法及时进行错误处理。

```
Uncaught ReferenceError: aa is not defined
    at Object.<anonymous> (bundle.js?fa290b1c30efc725362d:1)
```

当source map存在时问题就变的简单了，控制台直接指向出错的源文件，告诉你main.js文件第29行出错了，一针见血。

```
Uncaught ReferenceError: aa is not defined
    at Object.<anonymous> (main.js:29)
```

** 现代浏览器一般情况下都是默认支持source map的，如果无法确定可以打开浏览器控制台设置，确保enable javaScript/css source map被启用。
具有source map的文件末尾会多一条sourceMappingURL，表示source map文件的位置。
经过测试Chrome，FireFox，Edge，IE11,Safari 目前都是支持source map的，除了Edge在错误定位上有点小瑕疵（定位不准，有偏差）。

```
//# sourceMappingURL=bundle.js.map
```


## webpack中的source map

webpack 文档中关于 devtool 给出了7种模式，文档也写得非常简略，如下：

模式 | 解释
----|------
eval | 每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 //@ sourceURL
source-map |生成一个 SourceMap 文件
hidden-source-map | 和 source-map 一样，但不会在 bundle 末尾追加注释
inline-source-map | 生成一个 DataUrl 形式的 SourceMap 文件
eval-source-map | 每个 module 会通过 eval() 来执行，并且生成一个 DataUrl 形式的 SourceMap
cheap-source-map | 生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 sourcemap
cheap-module-source-map |生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的

看似配置项很多，其实只是五个关键字eval，source-map，cheap，module，inline的任意组合。这五个关键字每一项都代表一个特性，这四种特性可以任意组合。
它们分别代表以下五种特性：

> eval： 使用eval包裹模块代码

> source-map： 产生.map文件

> cheap： 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的source map

> module： 包含loader的sourcemap（比如jsx to js ，babel的source map）

> inline： 将.map作为DataURI嵌入，不单独生成.map文件（这个配置项比较少见）

eval和source-map都是webpack中devtool的配置选项， eval模式是使用eval将webpack中每个模块包裹，然后在模块末尾添加模块来源//# souceURL，依靠souceURL找到原始代码的位置。包含eval关键字的配置项并不单独产生.map文件
（eval模式有点特殊， 它和其他模式不一样的地方是它依靠sourceURL来定位原始代码， 而其他所有选项都使用.map文件的方式来定位）。
包含source-map关键字的配置项都会产生一个.map文件，该文件保存有原始代码与运行代码的映射关系， 浏览器可以通过它找到原始代码的位置。
（注：包含inline关键字的配置项也会产生.map文件，但是这个map文件是经过base64编码作为DataURI嵌入），举个栗子：eval-source-map是eval和source-map的组合，可知使用eavl语句包括模块，也产生了.map文件。webpack将.map文件作为DataURI替换eval模式中末尾的//# souceURL。按照我自己的理解， eval和.map文件都是sourcemap实现的不同方式，虽然大部分sourcemap的实现是通过产生.map文件， 但并不表示只能通过.map文件实现。下面是eval模式后产生的模块代码：

![](https://segmentfault.com/img/bVI3qw?w=741&h=445)

debug的时候大部分人都只在意代码的行数， 很少关注列数， 列数就是该行代码从第一个字符开始到定位字符的位置（包括空白字符），
包含cheap关键字的模式不包含列信息，体现在webpack中就是：如果包含cheap关键字，则产生的.map文件不包含列信息。也就是说当你在浏览器中点击该代码的位置时，
光标只定位到行数，不定位到具体字符位置。而不包含cheap关键字时， 点击控制台log将会定位到字符位置。
而不包含loader的source map指的是：如果你使用了诸如babel等代码编译工具时，定位到的原始代码将是经过编译后的代码位置，而非原始代码。

inline-source-map指的是：末尾的注释会将 sourceMap 作为 DataURL 的形式被内嵌进了 bundle 中，由于 sourceMap 的所有信息都被加到了 bundle 中，整个 bundle 文件变得硕大无比。

hidden-source-map 与 source-map 相比少了末尾的注释，但 输出目录下的 .map 文件没有少。

需要补充的是module关键字，当加上module关键字时，webpack将会添加loader的sourcemap。

## 使用哪个模式好

开发环境推荐：

> cheap-module-eval-source-map

生产环境推荐：

> cheap-module-source-map

原因如下：

1. 使用 cheap 模式可以大幅提高 source map 生成的效率。大部分情况我们调试并不关心列信息，而且就算 source map 没有列，有些浏览器引擎（例如 v8） 也会给出列信息。
2. 使用 eval 方式可大幅提高持续构建效率。参考官方文档提供的速度对比表格可以看到 eval 模式的编译速度很快。
3. 使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用）。
4. 使用 eval-source-map 模式可以减少网络请求。这种模式开启 DataUrl 本身包含完整 source map 信息，并不需要像 sourceURL 那样，浏览器需要发送一个完整请求去获取 source map 文件，这会略微提高点效率。而生产环境中则不宜用 eval，这样会让文件变得极大。

![SourceMap 模式效率对比图](https://lc-api-gold-cdn.xitu.io/a2e245898b08cdc389a2.jpeg)

### 推荐链接

[打破砂锅问到底：详解Webpack中的sourcemap](https://segmentfault.com/a/1190000008315937)

[webpack的devtool里的7种SourceMap模式是什么鬼？](https://juejin.im/post/58293502a0bb9f005767ba2f)

