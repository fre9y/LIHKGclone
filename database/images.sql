CREATE TABLE images (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP with time zone,
	updated_at TIMESTAMP with time zone,
    replies_id INTEGER NOT NULL,
    FOREIGN KEY (replies_id) REFERENCES replies(id),
    posts_id INTEGER NOT NULL,
    FOREIGN KEY (posts_id) REFERENCES posts(id)
);

SELECT * FROM images;

insert into images (name, created_at, updated_at, replies_id, posts_id) values ('2jNOiiJ.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00', 1, 1) 
                                                        -- ('Hgc8BnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('RR5BLge.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('wxzDSbo.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('325679440_506770358247188_8300883815140380734_n.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('maxresdefault.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('Bt7TgUW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('thumbnail.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('BzM1WnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('HM4ZH2U.gif', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('nPh4oc1.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('dVZBYTG.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('142928_57db03037ba56b929eeb0e3ec3e35b07.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('mobile01-e64c334ce6d74ff92119dc5cb9664ef8.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('Yh9wi9L.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('800x.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('g7ZD6Oz.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('U59tOQW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('33zQ699.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('ryQhdDa.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        -- ('Rpr1i3A.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00');

SELECT name FROM images;