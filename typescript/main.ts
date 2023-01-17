import express from 'express';
import type { Request, Response } from "express";
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
//import expressSession from "express-session";
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

async function connectDatabase() {

    await client.connect();
    console.log("db connected");
    await client.end();
    console.log("db disconnected");
}
connectDatabase();


app.use(express.static("public"));
app.use(express.static("uploads")); //photos in folder can be found

app.get("/", (req: Request, res: Response) => {
    const homePages = path.join(__dirname, 'public/home.html');
    if (!homePages) {
        res.status(404).json({
            message: 'Not Found'
        });
        return;
    } else {
        res.sendFile(homePages);
    }
});



























app.use((req, res) => {
    res.redirect("404.html");
});

const port = 8080;
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});