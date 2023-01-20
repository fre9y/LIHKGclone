import express from 'express';
import session from 'express-session';
import path from 'path';
import { client } from '../main';
// import { QueryResult } from 'pg';


const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "zoe",
    resave: true,
    saveUninitialized: true
}))
declare module "express-session" {
    interface SessionData {
        name?: string;
    }
}

app.get("/stations/:stations", async (req, res) => {
    let stations = req.params.stations;
    const stationsID = await client.query(
        `SELECT * FROM stations WHERE id = ${stations}`
    );

    // console.table(stationsID.rows[0].id);
    if (!stations || !stationsID) {
        res.status(400).json({
            message: 'opps'
        });
    } else {
        res.sendFile(path.resolve(__dirname, '../public/stations.html'));
    };
})







const port = 8100;
app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});