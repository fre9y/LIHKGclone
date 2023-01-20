CREATE TABLE images (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	created_at TIMESTAMP with time zone,
	updated_at TIMESTAMP with time zone,
    posts_id INTEGER NOT NULL,
    FOREIGN KEY (posts_id) REFERENCES posts(id),
    replies_id INTEGER NOT NULL,
    FOREIGN KEY (replies_id) REFERENCES replies(id)
);

SELECT * FROM images;
SELECT posts_id, name FROM images where posts_id = 1;

insert into images (name, created_at, updated_at, posts_id, replies_id) values ('2jNOiiJ.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,1),
                                                        ('Hgc8BnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,2),
                                                        ('RR5BLge.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,3),
                                                        ('wxzDSbo.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,4),
                                                        ('325679440_506770358247188_8300883815140380734_n.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,5),
                                                        ('maxresdefault.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,6),
                                                        ('Bt7TgUW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',1,7),
                                                        ('thumbnail.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,9),
                                                        ('BzM1WnT.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,10),
                                                        ('HM4ZH2U.gif', '2022-07-01 00:00:00', '2022-07-01 00:00:00',2,12),
                                                        ('nPh4oc1.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,13),
                                                        ('dVZBYTG.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,14),
                                                        ('142928_57db03037ba56b929eeb0e3ec3e35b07.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,16),
                                                        ('mobile01-e64c334ce6d74ff92119dc5cb9664ef8.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',3,17),
                                                        ('Yh9wi9L.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,18),
                                                        ('800x.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,19),
                                                        ('g7ZD6Oz.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,20),
                                                        ('U59tOQW.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',4,21),
                                                        ('33zQ699.png', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,22),
                                                        ('ryQhdDa.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,23),
                                                        ('Rpr1i3A.jpg', '2022-07-01 00:00:00', '2022-07-01 00:00:00',5,25);

