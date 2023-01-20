export interface Post {
	id: number
	nickname: string
	time: string
	likes: number
	title: string
	numberOfReplies: number
	station: string
}

export interface Reply {
	content?: string
	image?: string
	id: string
}