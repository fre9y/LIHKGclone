import express from 'express'
import { logger } from '../util/logger'
import { Reply } from '../typescript/model'
import { isLoggedInAPI } from '../typescript/guard'
import { client } from '../typescript/main'
import { formParsePromise } from '../typescript/formidable'

export const replyRoutes = express.Router()

replyRoutes.get('/', getReplies)
replyRoutes.post('/', createReplies)
replyRoutes.put('/:id', isLoggedInAPI, updateReplyById)
replyRoutes.delete('/:id', isLoggedInAPI, deleteReplyById)
replyRoutes.get('/like/user/:userId', getUserReplies)

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

export async function deleteReplyById(
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

		await client.query(`delete from replies where id = $1`, [replyId])

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

// in main.ts
// import { replyRoutes } from '../typescript/reply'
// app.use('/replies', replyRoutes)