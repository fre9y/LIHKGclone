import express from 'express'

export const isLoggedIn = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.['user']) {
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
	if (req.session?.['user']) {
		console.log('isLoggedInAPI approved');
		
		next()
	} else {
		console.log('isLoggedInAPI not approved');

		res.redirect('/userProfile.html')
		// res.status(403).json({
		// 	message: 'Unauthorized'
		// })
	}
}

export const isAdmin = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.['admin']) {
		next()
	} else {
		res.status(403).json({
			message: 'Unauthorized'
		})
	}
}

export const isP = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	if (req.session?.['p']) {
		res.status(403).json({
			message: 'Unauthorized'
		})
	} else {
		next()
	}
}

// export const isYourPost = (
// 	req: express.Request,
// 	res: express.Response,
// 	next: express.NextFunction
// ) => {
// 	if (req.session?.['userId']) {
// 		next()
// 	} else {
// 		res.status(403).json({
// 			message: 'Unauthorized'
// 		})
// 	}
// }



// export const isYourReply = (
// 	req: express.Request,
// 	res: express.Response,
// 	next: express.NextFunction
// ) => {
// 	if (req.session?.['userId']) {
// 		next()
// 	} else {
// 		res.status(403).json({
// 			message: 'Unauthorized'
// 		})
// 	}
// }