-- Users -> stations -> images -> posts -> replies -> favourite


CREATE TABLE posts (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    post_title TEXT not null,
    station_id INTEGER not null,
    FOREIGN KEY (station_id) REFERENCES stations(id),
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
