-- # 1/ users
-- # 2/ stations
-- # 3/ posts
-- # 4/ replies
-- # 5/ images
-- # 6/ favourite_posts
-- # 7/ user_blacklists
-- # 8/ user_followings

/*POSTS*/

create table users(
    id serial primary key,
    nickname varchar(255) not null,
    email varchar(255) not null unique,
    is_admin boolean default false not null,
    is_p boolean default true not null,
    is_male boolean default true not null,
    show Boolean not null default true,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null

);

insert into users
(nickname, email, is_admin, is_p,is_male)
values
('csy', 'cyrus0222@gbd.com', false, false, true),
('鴨鴨點啫', 'duckduck@abc.com', false, false, false),
('連尼住', 'lineage@lihkg.com', true, false, true),
('F9', 'fourier@cuhk.edu.hk', false, false, true),
('meeee', 'admin@tecky.io', true, false, false),
('yurayura', 'yurayura@123.com', false, true, false),
('1機械人一', 'bot1@botbot.com', false, true, true),
('2機械人二', 'bot2@botbot.com', false, true, true),
('3機械人三', 'bot3@botbot.com', false, true, true),
('漢語多功能字庫', 'bbb@cuhk.edu.hk', false, true, false),
('me', '0fr3ddy0@gmail.com', true, false, false),
('Anton', 'antonyeung919@gmail.com', true, false, true);




/*STATIONS*/

CREATE TABLE stations(
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE
);

insert into stations (name) values ('吹水台'), 
                                    ('熱門'),
                                    ('最新'),
                                    ('手機台'),
                                    ('時事台'),
                                    ('體育台'),
                                    ('娛樂台'),
                                    ('動漫台'),
                                    ('Apps台'),
                                    ('遊戲台'),
                                    ('影視台'),
                                    ('講故台'),
                                    ('潮流台'),
                                    ('上班台'),
                                    ('財經台'),
                                    ('飲食台'),
                                    ('旅遊台'),
                                    ('學術台'),
                                    ('校園台'),
                                    ('汽車台'),
                                    ('音樂台'),
                                    ('硬件台'),
                                    ('攝影台'),
                                    ('玩具台'),
                                    ('寵物台'),
                                    ('軟件台'),
                                    ('活動台'),
                                    ('站務台'),
                                    ('成人台'),
                                    ('感情台'),
                                    ('創意台'), 
                                    ('黑洞'),
                                    ('政事台'),
                                    ('直播台'),
                                    ('電訊台'),
                                    ('健康台'),
                                    ('房屋台'),
                                    ('World'),
                                    ('自選台');


/*POSTS*/

CREATE TABLE posts (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    post_title TEXT not null,
    station_id INTEGER not null,
    FOREIGN KEY (station_id) REFERENCES stations(id),
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    show Boolean not null default true
);



insert into posts
(post_title, station_id, user_id)
values
('陳柏宇真係好勁，the first take條片一日已經80萬，仲多過好多日本歌手', 32, 1),
('［突發］小弟姓胡 個女就黎出世 請問改咩名好？', 2, 2),
('第一次買樓，首選第一城，希望大家畀少少意見', 13, 2),
('李家超冀今年內取消口罩令', 8, 3),
('召喚痴線西 (216)', 10, 1),
('只知道是時候拿著金莎 將心意預留在藍罐之下', 2, 3);

/* REPLIES */
CREATE TABLE replies (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    page_number INTEGER not null default 1,
    likes INTEGER not null default 0,
    dislikes INTEGER not null default 0,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER not null,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    content TEXT,
    reference_id INTEGER,
    show Boolean not null default true
);

insert into replies
(user_id, post_id, content, reference_id, likes, dislikes)
values
(1, 1, '韋禮安一個月都係100萬view
陳伯真係掂', null, 0, 1),
(2, 1, '唱到咁樣同聿禮安比較，
其實算獻醜定爭光#', null, 1, 3),
(3, 1, '唔一定要高音先叫唱得好既', null, 3, 1),
(2, 1, '其實只係我地自己友係度瘋狂洗view', null, 7, 2),
(4, 1, '香港人真係哂鳩氣
有view 就自己人刷view 無鬼佬外國人睇
小view就恥笑
永遠唔可以正面面對一件事
跟本唔值得擁有好既人同事', null, 5, 7),
(2, 2, '胡鴻均👍🏻

一定孝順', null, 13, 1),
(3, 2, '胡錦濤', null, 9, 1),
(1, 2, '胡家寶藏', null, 2, 11),
(2, 2, '力威', null, 1, 23),
(4, 2, '唔練下身', 4, 0, 1),
(2, 3, '背景：自住，一個灣仔番工，一個觀塘番工，冇小朋友
筆直大約450萬
之前冇住過沙田區
睇中第一城交通，有商鋪食肆，靜中帶旺

心儀284/304呎單位

Concern位係大廈維修費/漏水問題

咁多位有無意見/貼士畀畀小弟
應該買邊個座向/有冇裝修/點樣查兇宅/車位是否足夠', null, 6, 12),
(2, 3, '外賣唔送自求多福', null, 0, 1),
(4, 3, '都40年樓, 真係好咩', null, 3, 2),
(3, 3, '與其買第一城咁舊嘅樓不如俾貴少少買啲同區新啲嘅樓，舊樓遲早無人買只會一路眨值', null, 0, 0),
(1, 3, '你就唔送', 2, 0, 0),
(3, 4, '香港與內地月初起恢復通關，高鐵香港段前日（15日）亦復運，社會期待香港可進一步邁向復常之路。行政長官李家超今日（17日）接受報章專訪時表示，通關第一階段的開放安全、有序、暢順，符合預期，自言很心急的他希望可以盡早開啟第二階段：「一定不會讓市民失望，而且能給多一點點驚喜。」通關之後，李家超表示希望今年內取消所有防疫限制，包括口罩令，揚言希望今年第一季解決所有問題，但重申作決策要務實，要看有沒有風險，不可只是盲衝。

原文網址: 李家超冀今年內取消口罩令　稱通關將有驚喜：第一季解決所有問題


蒙面法正式實施', null, 8, 24),
(3, 4, '都會繼續戴', null, 0, 1),
(2, 4, '除罩撚歡呼鳥', null, 4, 3),
(1, 4, '無口罩令帶口罩係咪告暴動🤣🤣🤣', null, 0, 0),
(1, 5, '精簡版： 有人爆咗殘廁咖啡 無從良過
想食花生 follow IG: seanlam_888

咖啡本身好激動想誹謗信
依加又覺得衝動咗

Sean 話夠100k 有證據 （自拍相）爆
不過覺得麻煩 唔信嘅
無人迫你哋follow', null, 1, 1),
(1, 5, 'lm', null, 5, 5),
(3, 5, 'lm', null, 6, 1),
(4, 5, '建議新嘅金剛棒update返欠債alex柒事', null, 3, 4),
(3, 6, '做你親友或許 容易團聚下又再傾舊時
                            二伯聽說有喜 初一的餐宴
                            恭喜 我再賀你新年
                            做你親友或許 容易
                            團聚下又再傾 舊時
                            二伯聽說有喜 初一的餐宴
                            恭喜 我再賀你新年', null, 3, 4),
(7, 2, '胡峯', null, 0, 3),
(8, 2, '胡香', null, 5, 11),
(9, 2, '胡說樓市', null, 2, 0),
(10, 2, '胡，單字一個「雪」，加埋就係「胡雪」', null, 5, 43),
(11, 2, '胡瑰麗', null, 0, 0),
(9, 2, '胡理小姐', null, 4, 0),
(1, 2, '胡朝豬吐', null, 21, 11),
(2, 2, '胡一刀', null, 0, 0),
(3, 2, '胡辣三小', null, 52, 11),
(4, 2, '胡桃', null, 2, 0),
(5, 2, '胡奕凡', null, 8, 19),
(6, 2, 'skr wu', null, 20, 0),
(7, 2, '胡杏兒', null, 2, 1),
(8, 2, '胡雪樹', null, 0, 0),
(9, 2, '胡鬧', null, 5, 9),
(10, 2, '胡囧囧', null, 2, 11),
(7, 2, '胡蘿蔔素', null, 0, 3),
(8, 2, '女仔就當然要佢理性 同 精明 胡理精', null, 5, 11),
(9, 2, '胡咁圖or老母', null, 2, 0),
(10, 2, '胡呢單刀', null, 5, 43),
(11, 2, '定欣，實西口西面', null, 0, 0),
(9, 2, '胡理小姐', null, 4, 0),
(1, 2, '就出世先上黎問', null, 21, 11),
(2, 2, '舒寶', null, 0, 0),
(3, 2, '胡作非', null, 52, 11),
(4, 2, '胡狸先生幾多點', null, 2, 0),
(5, 2, '胡十三幺', null, 8, 19),
(6, 2, '胡妮晶', null, 20, 0);


CREATE TABLE images (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP with time zone,
	updated_at TIMESTAMP with time zone,
    posts_id INTEGER NOT NULL,
    FOREIGN KEY (posts_id) REFERENCES posts(id),
    replies_id INTEGER NOT NULL,
    FOREIGN KEY (replies_id) REFERENCES replies(id)
);

insert into images (name, created_at, updated_at, posts_id, replies_id) values ('2jNOiiJ.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,1),
                                                        ('Hgc8BnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,2),
                                                        ('RR5BLge.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,3),
                                                        ('wxzDSbo.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,4),
                                                        ('325679440_506770358247188_8300883815140380734_n.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,5),
                                                        ('maxresdefault.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,6),
                                                        ('Bt7TgUW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,7),
                                                        ('thumbnail.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,9),
                                                        ('BzM1WnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,10),
                                                        ('HM4ZH2U.gif', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,12),
                                                        ('nPh4oc1.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,13),
                                                        ('dVZBYTG.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,14),
                                                        ('142928_57db03037ba56b929eeb0e3ec3e35b07.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,16),
                                                        ('mobile01-e64c334ce6d74ff92119dc5cb9664ef8.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,17),
                                                        ('Yh9wi9L.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,18),
                                                        ('800x.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,19),
                                                        ('g7ZD6Oz.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,20),
                                                        ('U59tOQW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,21),
                                                        ('33zQ699.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,22),
                                                        ('ryQhdDa.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,23),
                                                        ('Rpr1i3A.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,22);

-- SELECT * FROM replies where post_id = 5;

-- SELECT * FROM replies where post_id = 5;

-- SELECT * FROM replies JOIN users ON replies.user_id = users.id JOIN posts ON replies.post_id = posts.id WHERE replies.post_id = 2;
-- SELECT * FROM replies JOIN users ON replies.user_id = users.id JOIN posts ON replies.post_id = posts.id;

-- select (
--     select  json_agg(name) as images_id  from images  where replies_id = replies.id),      
--     (select is_male
--      from users 
--      where users.id = replies.user_id) as is_male,
--     users.nickname,
--     replies.* from replies
-- inner JOIN users on users.id = replies.user_id
--             where post_id = 5
-- 			and replies.show = TRUE
--             order by replies.id ASC;

create table favourite_posts(
    id SERIAL primary key,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER not null,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

insert into favourite_posts
(user_id, post_id)
values
(1,1),
(1,2),
(2,2),
(2,3),
(2,4),
(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(5,2),
(5,4),
(6,5),
(8,1),
(8,4),
(10,1);




CREATE TABLE user_blacklists (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    user_id_block_others INTEGER not null,
    FOREIGN KEY (user_id_block_others) REFERENCES users(id),
    user_id_being_blocked INTEGER not NULL,
    FOREIGN KEY (user_id_being_blocked) REFERENCES users(id)
);

insert into user_blacklists
(user_id_block_others, user_id_being_blocked)
values
(1,2),
(2,1),
(10,3),
(3,4),
(4,10),
(5,6);

-- select * from user_blacklists;




CREATE TABLE user_followings (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    user_id_follow_others INTEGER not null,
    FOREIGN KEY (user_id_follow_others) REFERENCES users(id),
    user_id_being_followed INTEGER not null,
    FOREIGN KEY (user_id_being_followed) REFERENCES users(id)
);

insert into user_followings
(user_id_follow_others, user_id_being_followed)
values
(1,3),
(1,4),
(1,5),
(10,11),
(11,1),
(11,2),
(11,3),
(11,4),
(11,5);

-- select * from user_followings;