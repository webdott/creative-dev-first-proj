const path = require("path");
const { DefinePlugin } = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
    entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],

    resolve: {
        modules: [dirApp, dirShared, dirStyles, dirNode],
    },

    plugins: [
        new CleanWebpackPlugin(),

        new DefinePlugin({
            IS_DEVELOPMENT,
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./shared",
                    to: "",
                },
            ],
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),

        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                    ],
                },
            },
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                },
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "",
                        },
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },

            {
                test: /\.(png|jpe?g|gif|svg|webp|fnt|woff2)$/,
                loader: "file-loader",
                options: {
                    name(file) {
                        return "[hash].[ext]";
                    },
                },
            },

            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: ImageMinimizerPlugin.loader,
                    },
                ],
            },

            {
                test: /\.(glsl|vert|frag)$/,
                loader: "raw-loader",
                exclude: /node_modules/,
            },

            {
                test: /\.(glsl|vert|frag)$/,
                loader: "glslify-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
