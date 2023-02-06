import express from 'express'
import path from 'path';
import { client } from '../main';

export const stationRoutes = express.Router()

// localhost:8080/stations/abc
stationRoutes.get('/:id', async (req, res) => {
    // res.json({
    //     msg: "123"
    // })
    const homePages = path.resolve(__dirname, '../public/home.html');
    // console.log(homePages)
    res.sendFile(homePages);
    // res.redirect("/home.html")
});

stationRoutes.get("/abc", async (req, res) => {
    res.json({
        msg: "abc"
    })
})
// localhost:8080/stations/:id/hit-posts
stationRoutes.get('/:id/hit-posts', async (req, res) => {
    let stationsID = req.params.id;
    const stationsNUM = await client.query(
        `SELECT * FROM stations WHERE id = ${stationsID}`
    );

    const hitStation = await client.query(
        `select id,
        (select nickname
                from users 
                where users.id = posts.user_id) as nickname, 
                (select is_male
                from users 
                where users.id = posts.user_id) as is_male, 
                (select is_p
                from users 
                where users.id = posts.user_id) as is_p, 
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
      and posts.show = true
            order by likes DESC;`
    );

    if (stationsID = stationsNUM.rows[0]) {
        res.json({
            stations: stationsNUM.rows,
            hitStation: hitStation.rows
        });
    } else {
        res.status(404).json({
            message: "opps"
        })
        return;
    }
})

//based on update time
stationRoutes.get("/:id/posts", async (req, res) => {
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
              (select is_p
              from users 
              where users.id = posts.user_id) as is_p, 
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
    and posts.show = true
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