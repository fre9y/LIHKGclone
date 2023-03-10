export interface Reply {
	content?: string
	image?: string
	id: string
}

export interface User {
    id: number;
    nickname: string;
    email: string,
    is_admin: boolean,
    is_p: boolean,
    is_male: boolean,
    show: boolean,
    created_at: Date,
    updated_at: Date,
}

export interface UserPosts {
    nickname: string,
	updated_at: Date,
	likes: number,
	numberOfReplies: number,
	post_title: string,
	station_name: string,
	user_is_male: boolean,
	post_id: number,
}