import express from 'express';
import session from 'express-session';
import path from 'path';
import formidable from 'formidable';


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

app.get("/stations/:stations", (req, res) => {
    const stations = req.params.stations;
    const stationsID = req.query.stationsID;
    const stationsNUM = 

    if (stationsID == stationsNUM) {}
})







const port = 8100;
app.listen(port,() => {
    console.log(`http://localhost:${port}/`)
});