import express from 'express'
import { logger } from '../util/logger'
import { Post, UserPosts } from '../model/model'
import { isLoggedInAPI, isP, isAdmin } from '../util/guard'
import { client } from '../main'
import { formParsePromise } from '../util/formidable'

export const postRoutes = express.Router()

// postRoutes.get('/:stationId', getPosts)
postRoutes.post('/', isLoggedInAPI, isP, createPosts)
postRoutes.get('/:id', getUserPosts)
// postRoutes.put('/', isLoggedInAPI, isP, isYourPost, updatePostById)
// postRoutes.put('/', isLoggedInAPI, isAdmin, hidePostById)
// postRoutes.put('/', isLoggedInAPI, isAdmin, showPostById)
// postRoutes.get('/:userId', getUserPosts)
// postRoutes.get('/', getHotPosts)
// postRoutes.get('/', isLoggedInAPI, getMyPosts)

export async function getPosts(req: express.Request, res: express.Response) {
	try {
		let stationId = req.params.stationId
		let result = await client.query(
			`
            select id,
				(select nickname 
                from users 
                where users.id = posts.user_id) as nickname, 
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
                where posts.station_id = stations.id) as station_name
            from posts
			where station_id = $1
			and show = true
            order by updated_at DESC
            `,
			[Number(stationId)]
		)
		let posts: Post[] = result.rows

		res.json({
			data: posts,
			message: 'Get posts success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS001] - Server error'
		})
	}
}

export async function createPosts(req: express.Request, res: express.Response) {
	try {
		let { fields, files } = await formParsePromise(req)
		let title = fields.postTitle
        let station = fields.stationId
		let content = fields.content
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
			message: 'add post success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS002] - Server error'
		})
	}
}

export async function updatePostById(
	req: express.Request,
	res: express.Response
) {
	try {
		let postId = req.params.id
		let postTitle = req.body.title

		await client.query(`update posts set post_title = $1 where id = $2`, [
			postTitle,
			postId
		])

		res.json({ message: 'ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS002] - Server error'
		})
	}
}

export async function hidePostById(
	req: express.Request,
	res: express.Response
) {
	try {
		let postId = req.params.id

		if (!Number(postId)) {
			res.status(400).json({
				message: 'Invalid post id'
			})
			return
		}

		await client.query(`update posts set show = false where id = $1`, [postId])

		res.json({ message: 'hide post ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS003] - Server error'
		})
	}
}

export async function showPostById(
	req: express.Request,
	res: express.Response
) {
	try {
		let postId = req.params.id

		if (!Number(postId)) {
			res.status(400).json({
				message: 'Invalid post id'
			})
			return
		}

		await client.query(`update posts set show = true where id = $1`, [postId])

		res.json({ message: 'show post ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS003] - Server error'
		})
	}
}

export async function getUserPosts(
	req: express.Request,
	res: express.Response
) {
	try {
		let userId = req.params.id
		if (!Number(userId)) {
			res.status(400).json({
				message: 'Invalid user id'
			})
			return
		}

		let data = (
			await client.query(
				`
				select (select nickname 
                    from users 
                    where users.id = posts.user_id) as nickname, 
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
				and show = true
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

export async function getHotPosts(req: express.Request, res: express.Response) {
	try {
		let stationId = req.params.stationId
		let result = await client.query(
			`
            select (select nickname 
                    from users 
                    where users.id = posts.user_id) as nickname, 
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
                    where posts.station_id = stations.id) as station_name
            from posts
			where station_id = $1
			and show = true
            order by number_of_replies DESC
            `,
			[Number(stationId)]
		)
		let posts: Post[] = result.rows

		res.json({
			data: posts,
			message: 'Get hot posts success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[POS001] - Server error'
		})
	}
}

export async function getMyPosts(
	req: express.Request,
	res: express.Response
) {
	try {
		let userId = req.params.userId

		if (!Number(userId)) {
			res.status(400).json({
				message: 'Invalid user id'
			})
			return
		}

		let userPosts = (
			await client.query(
				`
				select (select nickname 
                    from users 
                    where users.id = posts.user_id) as nickname, 
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
                    where posts.station_id = stations.id) as station_name
				from posts
				where user_id = $1
				and show = true
				`,
				[Number(userId)]
			)
		).rows

		res.json(userPosts)
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[ POS006 ] Server ERROR'
		})
	}
}