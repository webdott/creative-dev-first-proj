import { merge } from "webpack-merge";
import path from "path";
import { fileURLToPath } from "url";

import config from "./webpack.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devConfig = merge(config, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
    },
    output: {
        path: path.join(__dirname, "public"),
    },
});

export default devConfig;
