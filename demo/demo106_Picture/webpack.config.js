const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let extractTextPlugin = new ExtractTextPlugin({
    filename: "[name].min.css",
    allChunks: false
});

module.exports = {
    mode:'development',
    entry: {
        index: "./src/app.js"
    },
    output: {
        publicPath: __dirname + "/build/",
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: "style-loader"
                    },
                    use: [
                        {
                            loader: "css-loader"
                        }
                    ]
                })
            },
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
                    },
                    // img-loader for zip img
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
        ]
    },
    plugins: [extractTextPlugin]
};

