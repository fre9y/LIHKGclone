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
('召喚痴線西 (216)', 10, 1);

insert into posts
(post_title, station_id, user_id)
values
('只知道是時候拿著金莎 將心意預留在藍罐之下', 2, 3)

SELECT * FROM posts WHERE id = 1;
SELECT * FROM posts WHERE station_id = 2;
select * from posts;
Select * From posts JOIN users ON posts.user_id = users.id;
Select * From posts JOIN users ON posts.user_id = users.id WHERE posts.id = 2;