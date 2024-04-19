import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import express from "express";
import errorHandler from "errorhandler";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import logger from "morgan";
import UAParser from "ua-parser-js";
import methodOverride from "method-override";

import { client } from "./config/prismicConfig.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const handleLinkResolver = (doc) => {
    if (doc.type === "product") {
        return `/detail/${doc.uid}`;
    } else if (doc.type === "collections" || doc === "collections") {
        return `/collections`;
    } else if (doc.type === "about") {
        return `/about`;
    }

    return "/";
};

app.use(errorHandler());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.ctx = {
        prismic,
    };

    const ua = UAParser(req.headers["user-agent"]);

    res.locals.isDesktop = ua.device.type === undefined;
    res.locals.isPhone = ua.device.type === "mobile";
    res.locals.isTablet = ua.device.type === "tablet";

    res.locals.link = handleLinkResolver;

    res.locals.prismicH = prismicH;

    next();
});

const getEssentials = async () => {
    const [about, home, meta, preloader, navigation, { results: collections }] =
        await Promise.all([
            client.getSingle("about"),
            client.getSingle("home"),
            client.getSingle("metadata"),
            client.getSingle("preloader"),
            client.getSingle("navigation"),
            client.getByType("collection", {
                fetchLinks: "product.image",
            }),
        ]);

    const assets = [];

    home.data.gallery.forEach((item) => assets.push(item.image.url));
    about.data.gallery.forEach((item) => assets.push(item.image.url));

    about.data.body.forEach((section) => {
        if (section.slice_type === "gallery") {
            section.items.forEach((item) => assets.push(item.image.url));
        }
    });

    collections.forEach((collection) => {
        collection.data.products.forEach((item) =>
            assets.push(item.products_product.data.image.url)
        );
    });

    return { assets, about, home, meta, preloader, navigation, collections };
};

app.get("/", async (req, res) => {
    const [defaults] = await Promise.all([getEssentials()]);

    res.render("pages/home", {
        ...defaults,
    });
});

app.get("/about", async (req, res) => {
    const [about, defaults] = await Promise.all([
        client.getSingle("about"),
        getEssentials(),
    ]);
    res.render("pages/about", { about, ...defaults });
});

app.get("/detail/:uid", async (req, res) => {
    const [product, defaults] = await Promise.all([
        client.getByUID("product", req.params.uid, {
            fetchLinks: "collection.title",
        }),
        getEssentials(),
    ]);

    res.render("pages/detail", { product, ...defaults });
});

app.get("/collections", async (req, res) => {
    const [{ results: collectionResults }, defaults] = await Promise.all([
        client.getByType("collection", {
            fetchLinks: "product.image",
        }),
        getEssentials(),
    ]);

    res.render("pages/collections", {
        collections: collectionResults,
        ...defaults,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
