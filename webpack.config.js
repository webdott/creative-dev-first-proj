import path from "path";
import pkg from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import { fileURLToPath } from "url";

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirApp = path.join(__dirname, "app");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

const { DefinePlugin } = pkg;

const config = {
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

export default config;
