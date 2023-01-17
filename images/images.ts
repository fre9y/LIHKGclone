import express from 'express';
// import session from 'express-session';
import path from 'path';
// import formidable from 'formidable';

const app = express();

app.get('/getImages', (req, res) => {
    const getImagesHTML = path.join(__dirname,'images.html');
    res.sendFile(getImagesHTML);
})

const port = 8100;
app.listen(port,() => {
    console.log(`http://localhost:${port}/`)
});