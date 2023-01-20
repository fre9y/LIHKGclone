import express from 'express'
import { logger } from '../util/logger'
import { Reply } from '../model/model'
import { isLoggedInAPI, isP, isAdmin, isYourReply  } from '../util/guard'
import { client } from '../main'
import { formParsePromise } from '../util/formidable'

export const replyRoutes = express.Router()

replyRoutes.get('/', getReplies)
replyRoutes.post('/', isLoggedInAPI, createReplies)
replyRoutes.put('/:id', isLoggedInAPI, isP, isYourReply, updateReplyById)
replyRoutes.put('/:id', isAdmin, hideReplyById)
replyRoutes.put('/:id', isAdmin, showReplyById)
replyRoutes.get('/', getUserReplies)
replyRoutes.get('/', getHotReplies)
replyRoutes.put('/:id', isLoggedInAPI, isP, likeReplyById)
replyRoutes.put('/:id', isLoggedInAPI, isP, dislikeReplyById)
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
			and show = true
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
        let user = fields.user
        let post = fields.post
        let fileName = files.image ? files.image['newFilename'] : ''
        let content = fields.content
        let reference = fields.reference

		await client.query(
			`insert into replies (user_id, post_id, image_id, content, reference_id, created_at, updated_at) values ($1, $2, $3, $4, $5, now(), now())`,
			[user, post, fileName, content, reference]
		)

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
				message: 'Invalid user id'
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
				and show = true
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
			and show = true
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
		let replyLike = req.body.like

		await client.query(`update replies set likes = $2 + 1 where id = $1`, [
			replyLike,
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

export async function dislikeReplyById(
	req: express.Request,
	res: express.Response
) {
	try {
		let replyId = req.params.id
		let replyDislike = req.body.dislike

		await client.query(`update replies set dislikes = $2 + 1 where id = $1`, [
			replyDislike,
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