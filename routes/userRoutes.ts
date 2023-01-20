import express from 'express'
import fetch from 'cross-fetch'
import { client } from '../main'
export const userRoutes = express.Router();
userRoutes.get('/login/google', loginGoogle);
userRoutes.put('/profile', updateUser);
userRoutes.get('/profile', getUser);
//LOGIN + CREATE USER
async function loginGoogle (req:express.Request, res:express.Response){
    console.log('123');
    try {
        const accessToken = req.session?.['grant'].response.access_token;
        const fetchRes = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',{
            method:"get",
            headers:{
                "Authorization":`Bearer ${accessToken}`
            }
        });
        console.log('a');
        const googleUserProfile = await fetchRes.json();
        let users = (
            await client.query(
            `SELECT * FROM users WHERE users.email = $1`,
            [googleUserProfile.email])).rows;

        let user = users[0];
        console.log("b",user);
        if(!user){
            // Create the user when the user does not exist
            console.log("no user");
            let emailPrefix = googleUserProfile.email.split('@')[0];
            user = ( await client.query(
                    `INSERT INTO users (email,nickname) VALUES ($1,$2) RETURNING *`,
                    [googleUserProfile.email, emailPrefix])
                ).rows[0]
        }

        req.session['user'] = user 
        console.log(req.session['user']);
        return res.redirect('/profile.html')
    } catch(error) {
        console.log("ERR0R: " + error)
		res.status(500).json({
			message: '[SERVER ERROR]'
		})
    }
}

//UPDATE USER
export async function updateUser(
    req: express.Request, 
    res: express.Response
    ) {
    try {
        
        console.log("c",req.body);
        //console.log(res)
        let user = req.session['user'];
        console.log("SESSION",user);
        //        console.log(user.id);
        const updatedUser = await client.query(
            `UPDATE users SET nickname = $1, is_male = $2 WHERE id = $3`,
            [req.body.nickname,req.body.gender,user.id]
        );
        
        console.log("d",req.body.nickname,req.body.gender,user.id);
        res.json('[REDIRECTED TO HOME]')
        
    } catch (error) {
        console.log("ERR0R",error);
        res.status(500).json({
            message: '[SERVER ERROR]'
        })
    }
}


//READ USER
export async function getUser(
    req: express.Request, 
    res: express.Response
    ) {
    try {
        let user = req.session['user'];
        console.log(user);
        
        if (!user) {
             res.status(404).json({
                message: '[USER NOT FOUND]'
            })
            return
        }
        res.json(user)
        return
    } catch (error) {
        res.status(500).json({
            message: '[SERVER ERROR]'
        })
        return
    }
}
//SOFT-DELETE USER
//update email(+str) & update status
//post handling: 