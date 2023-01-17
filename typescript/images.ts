import express from 'express';
import session from 'express-session';
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';

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

const uploadDir = 'uploads';
fs.mkdirSync(uploadDir, {recursive: true});

const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFields: 1,
    maxFieldsSize: 10 * 1024 * 1024 **2,
    filter: (part) => {
        console.log("part = ", part);
        if (part.mimetype?.startsWith("image/")) {
            return true;
        } else {
            return false;
        }
    },
})

app.get('/getImages', (req, res) => {
    const getImagesHTML = path.join(__dirname,'images.html');
    res.sendFile(getImagesHTML);
})

const port = 8100;
app.listen(port,() => {
    console.log(`http://localhost:${port}/`)
});