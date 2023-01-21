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
        user:any;
        admin:any;
        P:any;
        userId:any;
    }
}

app.get('/stations', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../html/stations.html'));
})

app.get("/stations/:stations", async (req, res) => {
    let stations = req.params.stations;
    const stationsID = await client.query(
        `SELECT * FROM stations WHERE id = ${stations}`
    );
// console.table(stationsID.rows)
    res.json({
        stations: stationsID.rows
    });

    // if (stations = stationsID.rows[0]) {
    //     console.log(`station is stationsID`);
    //     res.redirect('/stations')
    //     return;
    // } else {
    //     console.log(`stations isNOT stationsID`);
    //     res.status(404).json({
    //         message: "opps"
    //     })
    //     return;
    // }
})



const port = 8100;
app.listen(port, () => {
    console.log('stations' , `http://localhost:${port}/`)
});