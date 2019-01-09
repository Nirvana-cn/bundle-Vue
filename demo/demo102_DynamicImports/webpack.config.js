const path=require('path');

module.exports={
    mode:'development',
    entry:{
        index:'./src/index.js'
    },
    output:{
        publicPath: __dirname + "/build/",
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    }
}