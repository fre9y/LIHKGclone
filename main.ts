import express from 'express';
import type { Request, Response } from "express";
import path from 'path';
import { Client } from "pg";
import dotenv from "dotenv";
import grant from "grant";
import expressSession from "express-session";
import { userRoutes } from './routes/userRoutes';
import { postRoutes } from './routes/postRoutes'
import { replyRoutes } from './routes/replyRoutes'


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
app.use('/posts', postRoutes)
app.use('/replies', replyRoutes)
app.use(express.static("protected"));
app.use(express.static("public"));
app.use(express.static("public/assets"));
app.use(express.static("uploads")); //photos in folder can be found
app.use(express.static("uploads/image"));

app.get("/", (req: Request, res: Response) => {
  const homePages = path.resolve(__dirname, 'public/home.html');
  if (!homePages) {
    res.status(404).json({
      message: 'Not Found'
    });
    return;
  } else {
    res.sendFile(homePages);
  }
});

//stations
app.get("/stations/", async (req, res) => {
  let stationsID = req.query.stationsID;
  const stationsNUM = await client.query(
    `SELECT * FROM stations WHERE id = ${stationsID}`
  );
  const postDetail = await client.query(
    // (present stations have post: 32,2,13,8,10)
    `SELECT * FROM posts JOIN users ON posts.user_id = users.id WHERE posts.station_id = ${stationsID}`
  )

  if (stationsID = stationsNUM.rows[0]) {
    res.json({
      stations: stationsNUM.rows,
      posts: postDetail.rows
    });
  } else {
    res.status(404).json({
      message: "opps"
    })
    return;
  }
});

// app.get('/post/:post/replies', async (req, res) => {
//   let postID = req.query.postID;
//   const postNUM = await client.query(
//     ``
//   )
// })

//image
app.get('/post/:post/media', async (req, res) => {
  let postId = req.params.post;
  const images = await client.query(
    `SELECT posts_id, name FROM images where posts_id = ${postId}`
  );

  res.json({
    images: images.rows
  });
})


























// app.use((req, res) => {
//     res.redirect("404.html");
// });

const port = 8080;
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});