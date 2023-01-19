import express from 'express';
import type { Request, Response } from "express";
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import grant from "grant";
import expressSession from "express-session";
import { userRoutes } from '../routes/userRoutes';

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();

//DATABASE
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

async function connectDatabase() {

    console.log({
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
      })
    await client.connect();
    console.log("db connected");

}
connectDatabase();
//

//GOOGLE LOGIN
const grantExpress = grant.express({
    defaults: {
      origin: "http://localhost:8080",
      transport: "session",
      state: true,
    },
    google: {
      //key: process.env.GOOGLE_CLIENT_ID || "",
      //secret: process.env.GOOGLE_CLIENT_SECRET || "",
      key: "950274264593-9id1o9l7vcdo0fefqt2qpjupaoteem9c.apps.googleusercontent.com",
      secret: "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",
      scope: ["profile", "email"],
      callback: "/user/login/google",
    },
  });
  
  app.use(
      expressSession({
          secret: "qwe",
          resave: true,
          saveUninitialized: true,
      })
  ); 
  
  app.use(grantExpress as express.RequestHandler);
  //




app.use('/user', userRoutes)
app.use(express.static("public"));
app.use(express.static("public/assets"));
app.use(express.static("uploads")); //photos in folder can be found

app.get("/", (req: Request, res: Response) => {
    const homePages = path.resolve(__dirname, '../public/home.html');
    if (!homePages) {
        res.status(404).json({
            message: 'Not Found'
        });
        return;
    } else {
        res.sendFile(homePages);

    }
});



























// app.use((req, res) => {
//     res.redirect("404.html");
// });

const port = 8080;
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});