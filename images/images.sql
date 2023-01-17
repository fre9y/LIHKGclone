CREATE TABLE images(
	id SERIAL PRIMARY KEY NOT NULL,
	name text NOT NULL,
	created_at TIMESTAMP with time zone,
	updated_at TIMESTAMP with time zone
);

insert into images (name, created_at, updated_at) values ('2jNOiiJ', '2022-07-01 00:00:00', '2022-07-01 00:00:00'), 
                                                        ('Hgc8BnT', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        ('RR5BLge', '2022-07-01 00:00:00', '2022-07-01 00:00:00'),
                                                        ('wxzDSbo', '2022-07-01 00:00:00', '2022-07-01 00:00:00');