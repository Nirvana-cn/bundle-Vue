const path = require("path");
const PurifyCSS = require("purifycss-webpack");
const glob = require("glob-all");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let extractTextPlugin = new ExtractTextPlugin({
    filename: "[name].min.css",
    allChunks: false
});

let purifyCSS = new PurifyCSS({
    paths: glob.sync([
        path.resolve(__dirname, "./*.html"), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, "./src/*.js")
    ])
});

module.exports = {
    mode:'development',
    entry: {
        index: "./src/index.js"
    },
    output: {
        publicPath: "build/",
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: {
                        loader: "css-loader"
                    }
                })
            }
        ]
    },
    plugins: [extractTextPlugin, purifyCSS]
};