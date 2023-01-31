import express from 'express'
import { logger } from '../util/logger'
import { Reply, User } from '../model/model'
import { isLoggedInAPI, isP, isAdmin } from '../util/guard'
import { client } from '../main'
import { formParsePromise } from '../util/formidable'

export const replyRoutes = express.Router()

// replyRoutes.get('/postId', getReplies)
replyRoutes.post('/', isLoggedInAPI, createReplies)
// replyRoutes.put('/', isLoggedInAPI, isP, isYourReply, updateReplyById)
// replyRoutes.put('/', isAdmin, hideReplyById)
// replyRoutes.put('/', isAdmin, showReplyById)
// replyRoutes.get('/', getUserReplies)
// replyRoutes.get('/', getHotReplies)
replyRoutes.patch('/:id/like', isLoggedInAPI, isP, likeReplyById)
replyRoutes.patch('/:id/dislike', isLoggedInAPI, isP, dislikeReplyById)
// replyRoutes.get('/:userId', getOthersById)

// likes/dislikes check repeat
export async function getReplies(req: express.Request, res: express.Response) {
	try {
        let postId = req.params.postId

		let result = await client.query(
			`
            select (select nickname 
                from users 
                where users.id = replies.user_id) as nickname, 
                updated_at, 
                content, 
                (select name 
                from images
                where images.id = replies.image_id) as image, 
                likes, 
                dislikes,
                post_id
            from replies
            where post_id = $1
			and replies.show = true
            order by id ASC
            `,
            [Number(postId)]
		)
		let replies: Reply[] = result.rows

		res.json({
			data: replies,
			message: 'Get replies success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP001] - Server error'
		})
	}
}

export async function createReplies(req: express.Request, res: express.Response) {
	try {
		let { fields, files } = await formParsePromise(req)
		let content = fields.replyContent
        let user = req.session['user'];
		let post = fields.postId

		let replyResult = await client.query(
			`insert into replies (user_id, post_id, content, created_at, updated_at) values ($1, $2, $3, now(), now()) returning id`,
			[user.id, Number(post), content]
		)

		let replyId = replyResult.rows[0].id

		if (files.image){
			let fileName = files.image['newFilename']
			await client.query(
				`insert into images (name, posts_id, replies_id, created_at, updated_at) values ($1, $2, $3, now(), now())`,
				[fileName, Number(post), Number(replyId)]
			)
		}

		res.json({
			message: 'add reply success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP002] - Server error'
		})
	}
}

export async function updateReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id
		let replyContent = req.body.content

		await client.query(`update replies set content = $1 where id = $2`, [
			replyContent,
			replyId
		])

		res.json({ message: 'ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP002] - Server error'
		})
	}
}

export async function hideReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id

		if (!Number(replyId)) {
			res.status(400).json({
				message: 'Invalid reply id'
			})
			return
		}

		await client.query(`update replies set show = false where id = $1`, [replyId])

		res.json({ message: 'delete reply ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP003] - Server error'
		})
	}
}

export async function showReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id

		if (!Number(replyId)) {
			res.status(400).json({
				message: 'Invalid reply id'
			})
			return
		}

		await client.query(`update replies set show = true where id = $1`, [replyId])

		res.json({ message: 'delete reply ok' })
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP003] - Server error'
		})
	}
}

export async function getUserReplies(
	req: express.Request,
	res: express.Response
) {
	try {
        let postId = req.params.postId
		let userId = req.params.userId

		if (!Number(userId)) {
			res.status(400).json({
				message: 'Invalid user id4'
			})
			return
		}

		let userReplies = (
			await client.query(
				`
                select (select nickname 
                    from users 
                    where users.id = replies.user_id) as nickname, 
                    updated_at, 
                    content, 
                    (select name 
                    from images
                    where images.id = replies.image_id) as image, 
                    likes, 
                    dislikes,
                    post_id
                from replies
                where post_id = $1 
                and user_id = $2
				and replies.show = true
                order by id ASC
				`,
				[Number(postId), Number(userId)]
			)
		).rows

		res.json(userReplies)
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[ REP006 ] Server ERROR'
		})
	}
}

export async function getHotReplies(req: express.Request, res: express.Response) {
	try {
        let postId = req.params.postId

		let result = await client.query(
			`
			select (select nickname 
				from users 
				where users.id = replies.user_id) as nickname, 
				updated_at, 
				content, 
				(select name 
				from images
				where images.id = replies.image_id) as image, 
				likes, 
				dislikes,
				post_id
			from replies
			where post_id =$ 1
			and replies.show = true
			order by likes DESC
            `,
            [Number(postId)]
		)
		let replies: Reply[] = result.rows

		res.json({
			data: replies,
			message: 'Get replies success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP001] - Server error'
		})
	}
}

export async function likeReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id

		await client.query(`update replies set likes = likes + 1 where id = $1`, [
			replyId,
		])

		const latestReplyLike = await client.query(
			`SELECT * FROM replies where replies.id = $1` , [
				replyId,
			]
			)

		res.json({ 
			latestReplyLike: latestReplyLike.rows[0]
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP002] - Server error'
		})
	}
}

export async function dislikeReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id

		await client.query(`update replies set dislikes = dislikes + 1 where id = $1`, [
			replyId,
		])

		const latestReplyDislike = await client.query(
			`SELECT * FROM replies where replies.id = $1` , [
				replyId,
			]
			)

			res.json({ 
				latestReplyDislike: latestReplyDislike.rows[0]
			})
		} catch (error) {
			logger.error(error)
			res.status(500).json({
				message: '[REP002] - Server error'
			})
		}
}

export async function getOthersById(
	req: express.Request,
	res: express.Response
	) {
	try {
        let userId = req.params.userId
		let result = await client.query(
			`
		=	select * from users where id  $1
            `,
            [Number(userId)]
		)
		let user: User[] = result.rows

		res.json({
			data: user,
			message: 'Get User Success'
		})
	} catch (error) {
		logger.error(error)
		res.status(500).json({
			message: '[REP001] - Server error'
		})
	}
}