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
