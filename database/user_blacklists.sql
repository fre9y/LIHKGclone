CREATE TABLE user_blacklists (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    user_id_block_others INTEGER not null,
    FOREIGN KEY (user_id_block_others) REFERENCES users(id),
    user_id_being_blocked INTEGER not null,
    FOREIGN KEY (user_id_being_blocked) REFERENCES users(id)
);









insert into user_blacklists
(user_id_block_others, user_id_being_blocked)
values
(1,2),
(2,1),
(10,3),
(3,4),
(4,10),
(5,6);

delete from user_blacklists where user_id_block_others = 12;
select * from user_blacklists;