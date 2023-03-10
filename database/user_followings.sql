CREATE TABLE user_followings (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    user_id_follow_others INTEGER not null,
    FOREIGN KEY (user_id_follow_others) REFERENCES users(id),
    user_id_being_followed INTEGER not null,
    FOREIGN KEY (user_id_being_followed) REFERENCES users(id)
);

insert into user_followings
(user_id_follow_others, user_id_being_followed)
values
(1,3),
(1,4),
(1,5),
(10,11),
(11,1),
(11,2),
(11,3),
(11,4),
(11,5);



delete from user_followings where user_id_follow_others = 12;
select * from user_followings;