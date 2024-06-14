import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/",(req,res) => {
    res.sendFile("index.html");
});

app.listen(port,(req,res) => {
    console.log(`Server running on port ${port}.`);
});