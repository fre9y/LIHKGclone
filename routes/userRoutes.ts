import express from 'express'
import fetch from 'cross-fetch'
import { client } from '../typescript/main'
export const userRoutes = express.Router();
userRoutes.get('/login/google', loginGoogle);

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
        console.log("b");
        if(!user){
            // Create the user when the user does not exist
            console.log("no user");
            user = ( await client.query(
                    `INSERT INTO users (email,nickname) VALUES ($1,$2) RETURNING *`,
                    [googleUserProfile.email,"asdfgh"])
                ).rows[0]
        }
        
        req.session['user'] = user
    
        return res.redirect('/home.html')
    } catch(error) {
        console.log(error)
		res.status(500).json({
			message: '[SERVER ERROR]'
		})
    }
}