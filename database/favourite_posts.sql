create table favourite_posts(
    id serial primary key,
    user_id INTEGER not null,
    FOREIGN KEY user_id REFERENCES users(id),
    posts_id INTEGER not null,
    FOREIGN KEY post_id REFERENCES posts(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),

);