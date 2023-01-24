import express from 'express'
import fetch from 'cross-fetch'
import { client } from '../main'
import { isLoggedInAPI  } from '../util/guard'
//import { User } from '../util/model'
export const userRoutes = express.Router();
userRoutes.get('/login/google', loginGoogle);
userRoutes.put('/profile', updateUser);
userRoutes.get('/profile', getUser);
userRoutes.get('/admin',getAllUsers);
userRoutes.put('/admin',softDeleteUser);

//LOGIN + CREATE USER
async function loginGoogle (req:express.Request, res:express.Response){
    //console.log('123');
    try {
        const accessToken = req.session?.['grant'].response.access_token;
        const fetchRes = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',{
            method:"get",
            headers:{
                "Authorization":`Bearer ${accessToken}`
            }
        });
        const googleUserProfile = await fetchRes.json();
        let users = (
            await client.query(
            `SELECT * FROM users WHERE users.email = $1`,
            [googleUserProfile.email])).rows;

        let user = users[0];
        console.log("GOGO|",user);
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
        return res.redirect('/userProfile.html')
    } catch(error) {
        console.log("ERR0R: " + error)
		res.status(500).json({
			message: '[USER001 - SERVER ERROR]'
		})
    }
}

//UPDATE USER
export async function updateUser(
    req: express.Request, 
    res: express.Response
    ) {
    try {
        
        console.log("BODY|",req.body);
        //console.log(res)
        let user = req.session['user'];
        console.log("SESSION|",user);
        //        console.log(user.id);
        const updatedUser = await client.query(
            `UPDATE users SET nickname = $1, is_male = $2 WHERE id = $3 RETURNING *`,
            [req.body.nickname,req.body.gender,user.id]
        );
        console.log(updatedUser.rows[0]);
        req.session['user'] = updatedUser.rows[0]
        console.log("NAME|MALE|ID",req.body.nickname,req.body.gender,user.id);
        res.json('[REDIRECTED TO HOME]')
        
    } catch (error) {
        console.log("ERR0R",error);
        res.status(500).json({
            message: '[USER002 - SERVER ERROR]'
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
        console.log("READ: ",user);

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
            message: '[USER003 - SERVER ERROR]'
        })
        return
    }
}

async function getAllUsers(
    req:express.Request, 
    res:express.Response
    ){
    try {
        const users = await client.query(
            `SELECT * FROM users ORDER BY id ASC`
        );

        //console.log("U53RR0W5: ",users.rows);
        res.json(users.rows)
        return

    } catch (error) {
        res.status(500).json({
            message: '[USER004 - SERVER ERROR]'
        })
        return
    }
}

//SOFT-DELETE USER
//not working yet* 
async function softDeleteUser(
    req:express.Request, 
    res:express.Response
    ){
    try {
        console.log("123");
        console.log("BODY|",req.body);

        let user = req.session['user'];
        //let user = req.body;
        console.log("SOFTDEL| ",user); 
        if (!user) {

             res.status(404).json({
                message: '[USER NOT FOUND]'
            })
            return
        }
        const deletedUser = await client.query(
            `UPDATE users SET email = $1, show = $2 WHERE id = $3 RETURNING *`,
            [req.body.email + "_DELETED",false,req.body.id]
        );
        console.log(deletedUser.rows[0]);
        //req.session['user'] = deletedUser.rows[0]
        res.json('[SOFT_DELETED]')
        return
    } catch (error) {
        res.status(500).json({
            message: '[SERVER ERROR]'
        })
        return
    }
}   