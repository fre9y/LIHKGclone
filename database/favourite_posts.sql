create table favourite_posts(
    id serial primary key,
    user_id integer not null,
    post_id integer not null

);