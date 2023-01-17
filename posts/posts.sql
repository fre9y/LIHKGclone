-- Users -> stations -> images -> posts -> replies -> favourite


CREATE TABLE posts (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    post_title TEXT not null,
    FOREIGN KEY (station_id) REFERENCES stations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- After replies

ALTER TABLE posts
    ADD COLUMN FOREIGN KEY (last_reply_time) REFERENCES replies(created_at);