
create table users(
    id serial primary key,
    nickname varchar(255) not null,
    email varchar(255) not null unique,
    is_admin boolean default false not null,
    is_p boolean default true not null,
    is_male boolean default true not null,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null

);
/*
3 google accounts
is_admin, is_p, !is_p
- is_admin:true, is_p: (not important), created_at:(not important)
admin override is_p
- is_admin: false, is_p: false, created_at: old date (manual edit)
- is_admin: false, is_p: true, created_at: new date (auto)
*/


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
('me', '0fr3ddy0@gmail.com', true, false, false);






select * from users;