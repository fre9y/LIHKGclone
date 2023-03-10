import express from 'express'
import expressSession from "express-session";
import fetch from 'cross-fetch'
import crypto from 'crypto'

import { client } from '../main'
import { isLoggedInAPI  } from '../util/guard'
//import { User } from '../util/model'
export const userRoutes = express.Router();
//self (normal user level)
userRoutes.get('/login/google', loginGoogle);
userRoutes.get('/logout', logout);
userRoutes.put('/profile', userUpdateSelf);
userRoutes.get('/profile', userGetSelf);
userRoutes.get('/profile/:id',isLoggedInAPI,userGetOthers);
userRoutes.get('/block', isLoggedInAPI, userGetBlockedUsers);
userRoutes.put('/block', isLoggedInAPI, userBlockOthers);
userRoutes.delete('/block', isLoggedInAPI, userUnblockOthers);
userRoutes.put('/bookmark', isLoggedInAPI, userBookmarkPosts)
userRoutes.delete('/bookmark', isLoggedInAPI, userDeleteBookmarkPosts)
userRoutes.put('/following', isLoggedInAPI, userAddFollowingUsers)
userRoutes.delete('/following', isLoggedInAPI, userDeleteFollowingUsers)
//self (admin level) 
userRoutes.get('/admin',getAllUsers); 
userRoutes.put('/admin',softDeleteUsers);

//LOGIN + CREATE USER
async function loginGoogle (
    req:express.Request,
    res:express.Response
    ){
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
};

//LOGOUT
async function logout(
    req:express.Request, 
    res:express.Response
    ){
    try {
        console.log("LOGOUT|",req.session['user']);
        delete req.session['user'];
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    } catch (error) {
        console.log("ERR0R",error);
        res.status(500).json({
            message: '[USER002 - SERVER ERROR]'
        })
    }
};

//UPDATE USER
export async function userUpdateSelf(
    req: express.Request, 
    res: express.Response
    ) {
    try {
        
        console.log("BODY|",req.body);
        //console.log(res)
        let user = req.session['user'];
        // console.log("SESSION|",user);
        //        console.log(user.id);
        const updatedUser = await client.query(
            `UPDATE users SET nickname = $1, is_male = $2 WHERE id = $3 RETURNING *`,
            [req.body.nickname,req.body.gender,user.id]
        );
        console.log(updatedUser.rows[0]);
        req.session['user'] = updatedUser.rows[0]
        console.log("NAME|isMALE|ID",req.body.nickname,req.body.gender,user.id);
        res.json('[REDIRECTED TO HOME]')
        
    } catch (error) {
        console.log("ERR0R",error);
        res.status(500).json({
            message: '[USER003 - SERVER ERROR]'
        })
    }
};


//READ SELF USER
export async function userGetSelf(
    req: express.Request, 
    res: express.Response
    ) {
    try {
        let user = req.session['user'];
        console.log("READ_SELF| ",user);

        if (!user) {
             res.status(400).json({
                message: '[USER NOT FOUND]'
            })
            return
        }
        
        res.json(user)
        return
    } catch (error) {
        res.status(500).json({
            message: '[USER004 - SERVER ERROR]'
        })
        return
    }
};

//READ OTHER USERS

async function userGetOthers(
    req:express.Request, 
    res:express.Response
    ){
    try {
        const users = await client.query(
            `SELECT * FROM users WHERE id = $1`,
            [req.params.id]
        );
        console.log("READ_OTHERS| ",users.rows);
        res.json(users.rows)
        return

    } catch (error) {
        res.status(500).json({
            message: '[USER005 - SERVER ERROR]'
        })
        return
    }
};

//GET BLOCKED USERS
async function userGetBlockedUsers(
    req:express.Request,
    res:express.Response
    ){
    try {
        let userId = req.session['user'].id;
        // console.log("SESSION|",user);
        const blockedUsers = await client.query(
            `SELECT * FROM user_blacklists join users on user_blacklists.user_id_being_blocked = users.id 
            WHERE user_blacklists.user_id_block_others = $1`,
            [userId]
        );

        console.log("BLOCKED_USERS| ",blockedUsers.rows);
        res.json(blockedUsers.rows)
        return
        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
    }
};

//BLOCK OTHER USERS
async function userBlockOthers(
    req:express.Request,
    res:express.Response
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedBlockUsers = await client.query(
            `INSERT INTO user_blacklists (user_id_block_others, user_id_being_blocked) VALUES ($1,$2) RETURNING *`,
            [user.id,req.body.id]
        );
        console.log(updatedBlockUsers.rows[0]);

        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
    }
};

//UNBLOCK OTHER USERS
async function userUnblockOthers(
    req:express.Request,
    res:express.Response
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedUnblockUsers = await client.query(
            `DELETE FROM user_blacklists WHERE user_id_block_others = $1 AND user_id_being_blocked = $2 RETURNING *`,
            [user.id,req.body.id]
        );
        console.log(updatedUnblockUsers.rows[0]);
        res.end('ok')
    } catch (error) {
        console.log("ERR0R",error);
        res.status(500).json({
        message: '[USER00? - SERVER ERROR]'
    })
    }
};



//BOOKMARK POSTS
async function userBookmarkPosts(
    req:express.Request,
    res:express.Response
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedBookmarkPost = await client.query(
            `INSERT INTO favourite_posts (user_id, post_id) VALUES ($1,$2) RETURNING *`,
            [user.id,req.body.id]
        );
        console.log(updatedBookmarkPost.rows[0]);
        res.json({
            bookmark: updatedBookmarkPost.rows[0]
        })
        return
        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
        return
    }
}
    
//DELETE BOOKMARK POSTS
async function userDeleteBookmarkPosts(
    req:express.Request,
    res:express.Response    
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedDeleteBookmarkPost = await client.query(
            `DELETE FROM favourite_posts WHERE user_id = $1 AND post_id = $2 RETURNING *`,
            [user.id,req.body.id]
        );
        console.log(updatedDeleteBookmarkPost.rows[0]);
        res.end('ok')
        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
    }
}

//ADD FOLLOWING USERS
async function userAddFollowingUsers(
    req:express.Request,
    res:express.Response
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedAddFollowingUsers = await client.query(
            `INSERT INTO user_followings (user_id_follow_others, user_id_being_followed) VALUES ($1,$2) RETURNING *`,
            [user.id,req.body.id]
        ); 
        console.log(updatedAddFollowingUsers.rows[0]);
        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
    }
}

async function userDeleteFollowingUsers(
    req:express.Request,
    res:express.Response
    ){
    try {
        console.log("BODY|",req.body);
        let user = req.session['user'];
        // console.log("SESSION|",user);
        const updatedDeleteFollowingUsers = await client.query(
            `DELETE FROM user_followings WHERE user_id_follow_others = $1 AND user_id_being_followed = $2 RETURNING *`,
            [user.id,req.body.id]
        );
        console.log(updatedDeleteFollowingUsers.rows[0]);
        } catch (error) {
            console.log("ERR0R",error);
            res.status(500).json({
            message: '[USER00? - SERVER ERROR]'
        })
    }
}



//ADMIN LEVEL

//READ ALL USERS
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
            message: '[USER006 - SERVER ERROR]'
        })
        return
    }
};

//SOFT-DELETE USER
//not working yet* 
async function softDeleteUsers(
    req:express.Request, 
    res:express.Response
    ){
    try {
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
        const randomNum = crypto.getRandomValues(new Uint32Array(1))
        const deletedUser = await client.query(
            `UPDATE users SET email = $1, show = $2 WHERE id = $3 RETURNING *`,
            [req.body.email + "_DELETED_" + randomNum ,false,req.body.id]
        );
        console.log(deletedUser.rows[0]);
        //req.session['user'] = deletedUser.rows[0]
        res.json('[SOFT_DELETED]')
        return
    } catch (error) {
        res.status(500).json({
            message: '[USER007 - SERVER ERROR]'
        })
        return
    }
} ;

