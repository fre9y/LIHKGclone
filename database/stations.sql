CREATE TABLE stations(
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE
);


select * from stations;
SELECT * FROM stations WHERE id = 3;

insert into stations (name) values ('吹水台'), 
                                    ('熱門'),
                                    ('最新'),
                                    ('手機台'),
                                    ('時事台'),
                                    ('體育台'),
                                    ('娛樂台'),
                                    ('動漫台'),
                                    ('Apps台'),
                                    ('遊戲台'),
                                    ('影視台'),
                                    ('講故台'),
                                    ('潮流台'),
                                    ('上班台'),
                                    ('財經台'),
                                    ('飲食台'),
                                    ('旅遊台'),
                                    ('學術台'),
                                    ('校園台'),
                                    ('汽車台'),
                                    ('音樂台'),
                                    ('硬件台'),
                                    ('攝影台'),
                                    ('玩具台'),
                                    ('寵物台'),
                                    ('軟件台'),
                                    ('活動台'),
                                    ('站務台'),
                                    ('成人台'),
                                    ('感情台'),
                                    ('創意台'), 
                                    ('黑洞'),
                                    ('政事台'),
                                    ('直播台'),
                                    ('電訊台'),
                                    ('健康台'),
                                    ('房屋台'),
                                    ('World'),
                                    ('自選台');

update stations set id = 999 where id = 39


