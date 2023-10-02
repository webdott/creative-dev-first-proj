import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import express from "express";
import errorHandler from "errorhandler";
import path from "path";
import { fileURLToPath } from "url";

import { client } from "./config/prismicConfig.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(errorHandler());

app.use((req, res, next) => {
    res.locals.ctx = {
        prismic,
    };

    res.locals.prismicH = prismicH;
    next();
});

app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/about", async (req, res) => {
    const [about, meta] = await Promise.all([
        client.getSingle("about"),
        client.getSingle("metadata"),
    ]);
    res.render("pages/about", { about, meta });
});

app.get("/detail/:uid", async (req, res) => {
    const [product, meta] = await Promise.all([
        client.getByUID("product", req.params.uid, {
            fetchLinks: "collection.title",
        }),
        client.getSingle("metadata"),
    ]);

    res.render("pages/detail", { product, meta });
});

app.get("/collections", (req, res) => {
    res.render("pages/collection");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
