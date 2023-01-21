CREATE TABLE stations(
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE
);

select * from stations;
SELECT * FROM stations WHERE id = 3;

insert into stations (name) values ('吹水台'), 
                                    ('創意台'), 
                                    ('講故台'),
                                    ('學術台'),
                                    ('自選台'),
                                    ('熱門台'),
                                    ('最新'),
                                    ('時事台'),
                                    ('政事台'),
                                    ('娛樂台'),
                                    ('World'),
                                    ('財經台'),
                                    ('房屋台'),
                                    ('手機台'),
                                    ('硬件台'),
                                    ('軟件台'),
                                    -- ('創意台'),
                                    ('飲食台'),
                                    ('旅遊台'),
                                    ('活動台'),
                                    ('健康台'),
                                    ('感情台'),
                                    ('上班台'),
                                    ('校園台'),
                                    ('體育台'),
                                    -- ('講故台'),
                                    ('影視台'),
                                    ('攝影台'),
                                    ('汽車台'),
                                    ('潮流台'),
                                    ('直播台'),
                                    -- ('學術台'),
                                    ('遊戲台'),
                                    ('動漫台'),
                                    ('音樂台'),
                                    ('寵物台'),
                                    ('玩具台'),
                                    ('站務台'),
                                    ('黑洞');


