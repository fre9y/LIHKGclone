import express from 'express';
import session from 'express-session';
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import { client } from '../main';

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


app.use(express.static("uploads/image"));
app.use(express.static("html"));

app.get('/getImages', (req, res) => {
    const getImagesHTML = path.resolve(__dirname, '../html/images.html');
    res.sendFile(getImagesHTML);
})



app.get('/post/:post/media', async (req, res) => {
    let postId = req.params.post;
    const images = await client.query(
        `SELECT posts_id, name FROM images where posts_id = ${postId}`
    );

    res.json({
        images: images.rows
    });
})



const port = 8100;
app.listen(port, () => {
    console.log('images ',`http://localhost:${port}/`)
});