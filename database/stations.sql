CREATE TABLE stations(
    id SERIAL PRIMARY KEY,
    name text NOT NULL
);

insert into stations (name) values ('吹水台'), 
                                    ('創意台'), 
                                    ('講故台'),
                                    ('學術台'),
                                    ('自選台'),
                                    ('熱門台'),
                                    ('最新');