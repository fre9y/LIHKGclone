-- Users -> stations -> images -> posts -> replies -> favourite


CREATE TABLE replies (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    page_number INTEGER not null,
    likes INTEGER not null,
    dislikes INTEGER not null,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER not null,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    image_id INTEGER not null,
    FOREIGN KEY (image_id) REFERENCES images(id),
    content TEXT
);

