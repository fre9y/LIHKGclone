create table favourite_posts(
    id SERIAL primary key,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER not null,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()

);