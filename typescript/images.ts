import express from 'express';
import session from 'express-session';
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import { client } from './main';

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

const uploadDir = 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });

const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFields: 1,
    maxFieldsSize: 10 * 1024 * 1024 ** 2,
    filter: (part) => {
        console.log("part = ", part);
        if (part.mimetype?.startsWith("image/")) {
            return true;
        } else {
            return false;
        }
    },
})


app.use(express.static("uploads/image")); //photos in folder can be found

app.get('/getImages', (req, res) => {
    const getImagesHTML = path.resolve(__dirname, '../html/images.html');
    res.sendFile(getImagesHTML);
})

function 

app.get('/post/:post/media', async (req, res) => {
    let stations = req.params.stations;
    let post = req.params.post;

    const stationsID = await client.query(
        `SELECT * FROM stations WHERE id = ${stations}`
    );
    const imagePath = await client.query(
        'SELECT name FROM images'
    )

    res.redirect()

    if (!stations || !stationsID) {
        res.status(400).json({
            message: 'opps'
        });
        return;
    }

    if (!post) {
        res.status(400).json({
            message: 'opps'
        });
        return;
    }

})



const port = 8100;
app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});