import express from 'express'

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		next()
	} else {
		res.redirect('/?error=no access right')
	}
}

export const isLoggedInAPI = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.user) {
		next()
	} else {
		res.status(403).json({
			message: 'Unauthorized'
		})
	}
}