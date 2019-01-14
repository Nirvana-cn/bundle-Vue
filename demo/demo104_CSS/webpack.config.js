const path = require("path");

module.exports = {
    mode:'development',
    entry: {
        index: "./src/index.js"
    },
    output: {
        publicPath: "build/",
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/, // 针对CSS结尾的文件设置LOADER
                use: [
                    {
                        loader: "style-loader/useable" // 注意此处的style-loader后面的 useable
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            }
        ]
    }
};