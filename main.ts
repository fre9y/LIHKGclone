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
// app.use('/posts', postRoutes)
// app.use('/replies', replyRoutes)
app.use(express.static("protected"));
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use(express.static("public/assets"));
app.use(express.static("uploads")); //photos in folder can be found
app.use(express.static("uploads/image"));


//stations
app.get("/", (req: Request, res: Response) => {
  res.redirect('/stations/1');
});

app.get('/stations/:id', async (req, res) => {
  const homePages = path.resolve(__dirname, 'public/home.html');
  res.sendFile(homePages);
});

app.get("/stations/:id/posts", async (req, res) => {
  let stationsID = req.params.id;
  const stationsNUM = await client.query(
    `SELECT * FROM stations WHERE id = ${stationsID}`
  );

  const postDetail = await client.query(
    `select id,
    (select nickname
            from users 
            where users.id = posts.user_id) as nickname, 
            (select is_male
            from users 
            where users.id = posts.user_id) as is_male, 
            (select max(updated_at)
            from replies
            where posts.id = replies.post_id) as updated_at, 
            (select sum(likes - dislikes)
            from replies
            where posts.id = replies.post_id) as likes, 
            (select count(post_id) 
            from replies
            where posts.id = replies.post_id) as number_of_replies, 
            post_title, 
            (select stations.id
            from stations 
            where posts.station_id = stations.id) as stations_id, 
            (select name 
            from stations
            where posts.station_id = stations.id) as station_name
        from posts
  where station_id = ${stationsID}
  and show = true
        order by updated_at DESC;`
  );

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

app.get('/post/:id/replies', async (req, res) => {
  let postID = req.params.id;
  const repliesDetail = await client.query(
    `select (
      select  json_agg(name) as images_id  from images  where replies_id = replies.id),      
      (select is_male
       from users 
       where users.id = replies.user_id) as is_male,
      users.nickname,
      replies.* from replies
  inner JOIN users on users.id = replies.user_id
              where post_id = ${postID}
        and replies.show = true
              order by replies.id ASC;`
  );

  const postDetail = await client.query(
    `Select * From posts JOIN users ON posts.user_id = users.id WHERE posts.id = ${postID}`
  )

  res.json({
    replies: repliesDetail.rows,
    posts: postDetail.rows
  })

  // return
})

// app.get('/post/:id/replies/pages/:pages', async (req, res) => {
//   let pages = req.params.pages;
//   const homePages = path.resolve(__dirname, 'public/home.html');
//   res.sendFile(homePages);

//   // return
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