import express from 'express'
import { logger } from '../util/logger'
import { isLoggedInAPI, isP } from '../util/guard'
import { client } from '../main'
import { formParsePromise } from '../util/formidable'

export const replyRoutes = express.Router()

replyRoutes.post('/', isLoggedInAPI, createReplies)
replyRoutes.patch('/:id/like', isLoggedInAPI, isP, likeReplyById)
replyRoutes.patch('/:id/dislike', isLoggedInAPI, isP, dislikeReplyById)

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
			latestReplyLike: latestReplyLike.rows[0],
			message: 'like success'
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
				latestReplyDislike: latestReplyDislike.rows[0],
				message: 'dislike success'
			})
		} catch (error) {
			logger.error(error)
			res.status(500).json({
				message: '[REP002] - Server error'
			})
		}
}