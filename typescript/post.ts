import express from 'express'
import { logger } from '../util/logger'
import { Post } from '../typescript/model'
// import { isLoggedInAPI } from '../typescript/guard'
import { client } from '../typescript/main'
import { formParsePromise } from '../typescript/formidable'

export const postRoutes = express.Router()

postRoutes.get('/', getPosts)
postRoutes.post('/', isP, createPosts)
postRoutes.put('/:id', isP, isYourPost, updatePostById)
postRoutes.put('/:id', isAdmin, hidePostById)
postRoutes.put('/:id', isAdmin, showPostById)
postRoutes.get('/like/user/:userId', getUserPosts)
postRoutes.get('/', getHotPosts)

export async function getPosts(req: express.Request, res: express.Response) {
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
		let { fields } = await formParsePromise(req)
		let title = fields.title
        let station = fields.station
        let user = fields.user

		await client.query(
			`insert into posts (post_title, station_id, user_id, created_at, updated_at) values ($1, $2, $3 now(), now())`,
			[title, station, user]
		)
// how to insert replies.Post_id at the same time?
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

// in main.ts
// import { postRoutes } from '../typescript/post'
// app.use('/posts', postRoutes)
