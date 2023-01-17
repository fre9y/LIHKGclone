-- Users -> stations -> images -> posts -> replies -> favourite


CREATE TABLE replies (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    page_number INTEGER not null,
    likes INTEGER not null,
    dislikes INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (image_id) REFERENCES images(id),
    content TEXT
);

