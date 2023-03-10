-- Users -> stations -> images -> posts -> replies -> favourite


CREATE TABLE replies (
    id SERIAL primary key,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    page_number INTEGER not null default 1,
    likes INTEGER not null default 0,
    dislikes INTEGER not null default 0,
    user_id INTEGER not null,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER not null,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    content TEXT,
    reference_id INTEGER,
    show Boolean not null default true
);

insert into replies
(user_id, post_id, content, reference_id, likes, dislikes)
values
(1, 1, '韋禮安一個月都係100萬view
陳伯真係掂', null, 0, 1),
(2, 1, '唱到咁樣同聿禮安比較，
其實算獻醜定爭光#', null, 1, 3),
(3, 1, '唔一定要高音先叫唱得好既', null, 3, 1),
(2, 1, '其實只係我地自己友係度瘋狂洗view', null, 7, 2),
(4, 1, '香港人真係哂鳩氣
有view 就自己人刷view 無鬼佬外國人睇
小view就恥笑
永遠唔可以正面面對一件事
跟本唔值得擁有好既人同事', null, 5, 7),
(5, 2, '胡鴻均👍🏻

一定孝順', null, 13, 1),
(3, 2, '胡錦濤', null, 9, 1),
(1, 2, '胡家寶藏', null, 2, 11),
(2, 2, '力威', null, 1, 23),
(4, 2, '唔練下身', 4, 0, 1),
(1, 3, '背景：自住，一個灣仔番工，一個觀塘番工，冇小朋友
筆直大約450萬
之前冇住過沙田區
睇中第一城交通，有商鋪食肆，靜中帶旺

心儀284/304呎單位

Concern位係大廈維修費/漏水問題

咁多位有無意見/貼士畀畀小弟
應該買邊個座向/有冇裝修/點樣查兇宅/車位是否足夠', null, 6, 12),
(2, 3, '外賣唔送自求多福', null, 0, 1),
(4, 3, '都40年樓, 真係好咩', null, 3, 2),
(3, 3, '與其買第一城咁舊嘅樓不如俾貴少少買啲同區新啲嘅樓，舊樓遲早無人買只會一路眨值', null, 0, 0),
(1, 3, '你就唔送', 2, 0, 0),
(4, 4, '香港與內地月初起恢復通關，高鐵香港段前日（15日）亦復運，社會期待香港可進一步邁向復常之路。行政長官李家超今日（17日）接受報章專訪時表示，通關第一階段的開放安全、有序、暢順，符合預期，自言很心急的他希望可以盡早開啟第二階段：「一定不會讓市民失望，而且能給多一點點驚喜。」通關之後，李家超表示希望今年內取消所有防疫限制，包括口罩令，揚言希望今年第一季解決所有問題，但重申作決策要務實，要看有沒有風險，不可只是盲衝。

原文網址: 李家超冀今年內取消口罩令　稱通關將有驚喜：第一季解決所有問題


蒙面法正式實施', null, 8, 24),
(3, 4, '都會繼續戴', null, 0, 1),
(2, 4, '除罩撚歡呼鳥', null, 4, 3),
(1, 4, '無口罩令帶口罩係咪告暴動🤣🤣🤣', null, 0, 0),
(1, 5, '精簡版： 有人爆咗殘廁咖啡 無從良過
想食花生 follow IG: seanlam_888

咖啡本身好激動想誹謗信
依加又覺得衝動咗

Sean 話夠100k 有證據 （自拍相）爆
不過覺得麻煩 唔信嘅
無人迫你哋follow', null, 1, 1),
(1, 5, 'lm', null, 5, 5),
(3, 5, 'lm', null, 6, 1),
(4, 5, '建議新嘅金剛棒update返欠債alex柒事', null, 3, 4);

insert into replies
(user_id, post_id, content, reference_id, likes, dislikes)
values (3, 6, '做你親友或許 容易團聚下又再傾舊時
                            二伯聽說有喜 初一的餐宴
                            恭喜 我再賀你新年
                            做你親友或許 容易
                            團聚下又再傾 舊時
                            二伯聽說有喜 初一的餐宴
                            恭喜 我再賀你新年', null, 3, 4);

insert into replies
(user_id, post_id, content, reference_id, likes, dislikes)
values (7, 2, '胡峯', null, 0, 3),
        (8, 2, '胡香', null, 5, 11),
        (9, 2, '胡說樓市', null, 2, 0),
        (10, 2, '胡，單字一個「雪」，加埋就係「胡雪」', null, 5, 43),
        (11, 2, '胡瑰麗', null, 0, 0),
        (9, 2, '胡理小姐', null, 4, 0),
        (1, 2, '胡朝豬吐', null, 21, 11),
        (2, 2, '胡一刀', null, 0, 0),
        (3, 2, '胡辣三小', null, 52, 11),
        (4, 2, '胡桃', null, 2, 0),
        (5, 2, '胡奕凡', null, 8, 19),
        (6, 2, 'skr wu', null, 20, 0),
        (7, 2, '胡杏兒', null, 2, 1),
        (8, 2, '胡雪樹', null, 0, 0),
        (9, 2, '胡鬧', null, 5, 9),
        (10, 2, '胡囧囧', null, 2, 11),
        (7, 2, '胡蘿蔔素', null, 0, 3),
        (8, 2, '女仔就當然要佢理性 同 精明 胡理精', null, 5, 11),
        (9, 2, '胡咁圖or老母', null, 2, 0),
        (10, 2, '胡呢單刀', null, 5, 43),
        (11, 2, '定欣，實西口西面', null, 0, 0),
        (9, 2, '胡理小姐', null, 4, 0),
        (1, 2, '就出世先上黎問', null, 21, 11),
        (2, 2, '舒寶', null, 0, 0),
        (3, 2, '胡作非', null, 52, 11),
        (4, 2, '胡狸先生幾多點', null, 2, 0),
        (5, 2, '胡十三幺', null, 8, 19),
        (6, 2, '胡妮晶', null, 20, 0)


SELECT * FROM replies where post_id = 2;
SELECT * FROM replies JOIN users ON replies.user_id = users.id JOIN posts ON replies.post_id = posts.id WHERE replies.post_id = 2;
SELECT * FROM replies JOIN users ON replies.user_id = users.id JOIN posts ON replies.post_id = posts.id;




select (
    select  json_agg(name) as images_id  from images  where replies_id = replies.id),      
    (select is_male
     from users 
     where users.id = replies.user_id) as is_male,
    users.nickname,
    replies.* from replies
inner JOIN users on users.id = replies.user_id
            where post_id = 2
			and show = true
            order by replies.id DESC
            LIMIT 25 OFFSET 25 * (1 -1);

insert into replies
(user_id, post_id, content, reference_id, likes, dislikes)
values (7, 2, '胡蘿蔔素', null, 0, 3),
        (8, 2, '女仔就當然要佢理性 同 精明 胡理精', null, 5, 11),
        (9, 2, '胡咁圖or老母', null, 2, 0),
        (10, 2, '胡呢單刀', null, 5, 43),
        (11, 2, '定欣，實西口西面', null, 0, 0),
        (9, 2, '胡理小姐', null, 4, 0),
        (1, 2, '就出世先上黎問', null, 21, 11),
        (2, 2, '舒寶', null, 0, 0),
        (3, 2, '胡作非', null, 52, 11),
        (4, 2, '胡狸先生幾多點', null, 2, 0),
        (5, 2, '胡十三幺', null, 8, 19),
        (6, 2, '胡妮晶', null, 20, 0)

UPDATE replies SET likes = likes + 1 WHERE replies.id = 1;
UPDATE replies set dislikes = 5 where replies.id = 29;
SELECT * FROM replies where replies.post_id = 2;

select id,
    (select nickname
            from users 
            where users.id = posts.user_id) as nickname, 
            (select is_male
            from users 
            where users.id = posts.user_id) as is_male, 
            (select max(updated_at)
            from replies
            where posts.id = replies.post_id) as updated_at, 
            (select sum(likes - dislikes)
            from replies
            where posts.id = replies.post_id) as likes, 
            (select count(post_id) 
            from replies
            where posts.id = replies.post_id) as number_of_replies, 
            post_title, 
            (select stations.id
            from stations 
            where posts.station_id = stations.id) as stations_id, 
            (select name 
            from stations
            where posts.station_id = stations.id) as station_name
        from posts
  where station_id = 2
  and posts.show = true
        order by updated_at ASC;

-- based on created_at
select id,
    (select nickname
            from users 
            where users.id = posts.user_id) as nickname, 
            (select is_male
            from users 
            where users.id = posts.user_id) as is_male, 
            (select max(created_at)
            from replies
            where posts.id = replies.post_id) as created_at, 
            (select sum(likes - dislikes)
            from replies
            where posts.id = replies.post_id) as likes, 
            (select count(post_id) 
            from replies
            where posts.id = replies.post_id) as number_of_replies, 
            post_title, 
            (select stations.id
            from stations 
            where posts.station_id = stations.id) as stations_id, 
            (select name 
            from stations
            where posts.station_id = stations.id) as station_name
        from posts
  where station_id = 2
  and posts.show = true
        order by created_at ASC;

-- all stations
select id,
    (select nickname
            from users 
            where users.id = posts.user_id) as nickname, 
            (select is_male
            from users 
            where users.id = posts.user_id) as is_male, 
            (select max(updated_at)
            from replies
            where posts.id = replies.post_id) as updated_at, 
            (select sum(likes - dislikes)
            from replies
            where posts.id = replies.post_id) as likes, 
            (select count(post_id) 
            from replies
            where posts.id = replies.post_id) as number_of_replies, 
            post_title, 
            (select stations.id
            from stations 
            where posts.station_id = stations.id) as stations_id, 
            (select name 
            from stations
            where posts.station_id = stations.id) as station_name
        from posts
  where posts.show = true
        order by likes DESC;

-- one station
select id,
    (select nickname
            from users 
            where users.id = posts.user_id) as nickname, 
            (select is_male
            from users 
            where users.id = posts.user_id) as is_male, 
            (select max(updated_at)
            from replies
            where posts.id = replies.post_id) as updated_at, 
            (select sum(likes - dislikes)
            from replies
            where posts.id = replies.post_id) as likes, 
            (select count(post_id) 
            from replies
            where posts.id = replies.post_id) as number_of_replies, 
            post_title, 
            (select stations.id
            from stations 
            where posts.station_id = stations.id) as stations_id, 
            (select name 
            from stations
            where posts.station_id = stations.id) as station_name
        from posts
  where station_id = 2
  and posts.show = true
        order by likes DESC;

select (
      select  json_agg(name) as images_id  from images  where replies_id = replies.id),      
      (select is_male
       from users 
       where users.id = replies.user_id) as is_male,
      users.nickname,
      replies.* from replies
  inner JOIN users on users.id = replies.user_id
              where post_id = 2
        and replies.show = true
              order by replies.id DESC