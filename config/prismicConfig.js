import fetch from "node-fetch";
import * as prismic from "@prismicio/client";

const repoName = "floema-webdot";
const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

export const client = prismic.createClient(repoName, {
    fetch,
    accessToken,
});
