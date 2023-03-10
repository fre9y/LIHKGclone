import express from 'express'
import { logger } from '../util/logger'
import { UserPosts } from '../model/model'
import { isLoggedInAPI, isP, isAdmin } from '../util/guard'
import { client } from '../main'
import { formParsePromise } from '../util/formidable'

export const postRoutes = express.Router()


postRoutes.post('/', isLoggedInAPI, isP, createPosts)
postRoutes.get('/:id/Users', getUserPosts)
postRoutes.get('/following', isLoggedInAPI, getFollowingPosts)
postRoutes.get('/fav', isLoggedInAPI, getFavPosts)

export async function createPosts(req: express.Request, res: express.Response) {
	try {
		let { fields, files } = await formParsePromise(req)
		let title = fields.postTitle
        let station = fields.stationId
		let content = fields.content
		console.log({content})
        let user = req.session['user'];

		let postResult = await client.query(
			`insert into posts (post_title, station_id, user_id, created_at, updated_at) values ($1, $2, $3, now(), now()) returning id`,
			[title, station, user.id]
		)
		let postId = postResult.rows[0].id

		let replyResult = await client.query(
			`insert into replies (user_id, post_id, content, created_at, updated_at) values ($1, $2, $3, now(), now()) returning id`,
			[user.id, Number(postId), content]
		)

		let replyId = replyResult.rows[0].id

		if (files.image){
			let fileName = files.image['newFilename']
			await client.query(
				`insert into images (name, posts_id, replies_id, created_at, updated_at) values ($1, $2, $3, now(), now())`,
				[fileName, Number(postId), Number(replyId)]
			)
		}

		res.json({
			data: postId,
			message: 'add post success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS002] - Server error'
		})
	}
}

export async function getUserPosts(
	req: express.Request,
	res: express.Response
) {
	try {
		let userId = req.params['id']
		if (!Number(userId)) {
			res.status(400).json({
				message: 'Invalid user id1'
			})
			return
		}

		let data = (
			await client.query(
				`
				select (select nickname 
                    from users 
                    where users.id = posts.user_id) as nickname, 
					(select is_p
					from users 
					where users.id = posts.user_id) as is_p, 
                    (select max(updated_at)
                    from replies
                    where posts.id = replies.post_id) as updated_at, 
                    (select sum(likes - dislikes)
                    from replies
                    where posts.id = replies.post_id) as likes, 
                    (select count(post_id) 
                    from replies
                    where posts.id = replies.post_id) as number_of_replies, 
                    post_title, 
                    (select name 
                    from stations
                    where posts.station_id = stations.id) as station_name,
					(select is_male 
					from users
					where users.id = posts.user_id) as user_is_male,
					id as post_id
				from posts
				where user_id = $1
				and posts.show = true
				order by updated_at Desc
				`,
				[Number(userId)]
			)
		)
		
		let userPostsData: UserPosts[] = data.rows

		res.json({
			data: userPostsData,
			message: 'Get userPosts success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[ POS006 ] Server ERROR'
		})
	}
}

export async function getFollowingPosts(
	req: express.Request,
	res: express.Response
) {
	try {
        let user = req.session['user'];
		if (!Number(user.id)) {
			res.status(400).json({
				message: 'Invalid user id3'
			})
			return
		}

		let data = (
			await client.query(
				`
				select 
					(select nickname from users
					where users.id = user_id_being_followed) as nickname,
					(select is_p
					from users 
					where users.id = posts.user_id) as is_p, 
					(select max(updated_at)
					from replies
					where posts.id = replies.post_id) as updated_at,
					(select sum(likes - dislikes)
					from replies
					where posts.id = replies.post_id) as likes, 
					(select count(post_id) 
					from replies
					where posts.id = replies.post_id) as number_of_replies, 
					post_title,
					(select name 
					from stations
					where posts.station_id = stations.id) as station_name,
					(select is_male 
					from users
					where users.id = posts.user_id) as user_is_male,
					posts.id as post_id
				from user_followings uf 
				left join posts on posts.user_id = user_id_being_followed 
				where user_id_follow_others  = $1
				and posts.show = true
				order by updated_at DESC
				`,
				[Number(user.id)]
			)
		)
		
		let followingPostsData: UserPosts[] = data.rows

		res.json({
			data: followingPostsData,
			message: 'Get FollowingPosts success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[ POS006 ] Server ERROR'
		})
	}
}

export async function getFavPosts(
	req: express.Request,
	res: express.Response
) {
	try {
        let user = req.session['user'];
		if (!Number(user.id)) {
			res.status(400).json({
				message: 'Invalid user id5'
			})
			return
		}

		let data = (
			await client.query(
				`
				select
					(select nickname from users
					where users.id = posts.user_id) as nickname,
					(select is_p
					from users 
					where users.id = posts.user_id) as is_p, 
					(select max(updated_at)
					from replies
					where posts.id = replies.post_id) as updated_at,
					(select sum(likes - dislikes)
					from replies
					where posts.id = replies.post_id) as likes,
					(select count(post_id) 
					from replies
					where posts.id = replies.post_id) as number_of_replies, 
					post_title,
					(select name 
					from stations
					where posts.station_id = stations.id) as station_name,
					(select is_male 
					from users
					where users.id = posts.user_id) as user_is_male,
					posts.id as post_id
				from favourite_posts 
				left join posts on posts.id = favourite_posts.post_id
				where favourite_posts.user_id  = $1
				and posts.show = true
				order by updated_at DESC
				`,
				[Number(user.id)]
			)
		)
		
		let favPostsData: UserPosts[] = data.rows

		res.json({
			data: favPostsData,
			message: 'Get FavPosts success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[ POS006 ] Server ERROR'
		})
	}
}