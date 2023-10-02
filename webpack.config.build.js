import path from "path";
import { merge } from "webpack-merge";
import { fileURLToPath } from "url";

import config from "./webpack.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildConfig = merge(config, {
    mode: "production",
    output: {
        path: path.join(__dirname, "public"),
    },
});

export default buildConfig;
