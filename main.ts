
import express from 'express';
import type { Request, Response } from "express";
//import expressSession from "express-session";
let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use((req: Request, res, next) => {
    try{
        next(); 
    } catch(error) {
        res.status(500).json({
            message: "[SECTION001]Server Error",
        });
        console.log(error);
    }
    
});


app.use(express.static("public"));
app.use(express.static("uploads")); //photos in folder can be found

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use((req, res) => {
  res.redirect("404.html");
});

const port = 8080
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});