import express from 'express';
import session from 'express-session';
// import path from 'path';
import { client } from './main';
// import { QueryResult } from 'pg';


const app = express();
app.use(express.urlencoded({extended: true}));

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
    let stationsID = req.params.stations;
    const stationsNUM = await client.query(
        `SELECT * FROM stations WHERE id = ${stationsID}`
    );
console.table(stationsNUM);
    // if (stationsID == stationsNUM.rows[0]) {

    // }
})







const port = 8100;
app.listen(port,() => {
    console.log(`http://localhost:${port}/`)
});