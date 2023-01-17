
import express from 'express';
import type { Request, Response } from "express";
import { Client } from "pg";
import dotenv from "dotenv";

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
  res.send("Hello World"); 
});

app.use((req, res) => {
  res.redirect("404.html");
});

const port = 8080
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});