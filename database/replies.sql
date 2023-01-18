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
    image_id INTEGER,
    FOREIGN KEY (image_id) REFERENCES images(id),
    content TEXT,
    reference_id INTEGER
);

insert into replies
(user_id, post_id, image_id, content, reference_id)
values
(1, 1, null, '韋禮安一個月都係100萬view
陳伯真係掂', null),
(2, 1, null, '唱到咁樣同聿禮安比較，
其實算獻醜定爭光#', null),
(3, 1, 2, '唔一定要高音先叫唱得好既', null),
(2, 1, null, '其實只係我地自己友係度瘋狂洗view', null),
(4, 1, 3, '香港人真係哂鳩氣
有view 就自己人刷view 無鬼佬外國人睇
小view就恥笑
永遠唔可以正面面對一件事
跟本唔值得擁有好既人同事', null),
(5, 2, null, '胡鴻均👍🏻

一定孝順', null),
(3, 2, null, '胡錦濤', null),
(1, 2, 1, '胡家寶藏', null),
(2, 2, null, '力威', null),
(4, 2, 4, '唔練下身', 4),
(1, 3, null, '背景：自住，一個灣仔番工，一個觀塘番工，冇小朋友
筆直大約450萬
之前冇住過沙田區
睇中第一城交通，有商鋪食肆，靜中帶旺

心儀284/304呎單位

Concern位係大廈維修費/漏水問題

咁多位有無意見/貼士畀畀小弟
應該買邊個座向/有冇裝修/點樣查兇宅/車位是否足夠', null),
(2, 3, 8, '外賣唔送自求多福', null),
(4, 3, 7, '都40年樓, 真係好咩', null),
(3, 3, 9, '與其買第一城咁舊嘅樓不如俾貴少少買啲同區新啲嘅樓，舊樓遲早無人買只會一路眨值', null),
(1, 3, null, '你就唔送', 2),
(4, 4, null, '香港與內地月初起恢復通關，高鐵香港段前日（15日）亦復運，社會期待香港可進一步邁向復常之路。行政長官李家超今日（17日）接受報章專訪時表示，通關第一階段的開放安全、有序、暢順，符合預期，自言很心急的他希望可以盡早開啟第二階段：「一定不會讓市民失望，而且能給多一點點驚喜。」通關之後，李家超表示希望今年內取消所有防疫限制，包括口罩令，揚言希望今年第一季解決所有問題，但重申作決策要務實，要看有沒有風險，不可只是盲衝。

原文網址: 李家超冀今年內取消口罩令　稱通關將有驚喜：第一季解決所有問題


蒙面法正式實施', null),
(3, 4, null, '都會繼續戴', null),
(2, 4, null, '除罩撚歡呼鳥', null),
(1, 4, null, '無口罩令帶口罩係咪告暴動🤣🤣🤣', null),
(1, 5, null, '精簡版： 有人爆咗殘廁咖啡 無從良過
想食花生 follow IG: seanlam_888

咖啡本身好激動想誹謗信
依加又覺得衝動咗

Sean 話夠100k 有證據 （自拍相）爆
不過覺得麻煩 唔信嘅
無人迫你哋follow', null),
(1, 5, 3, 'lm', null),
(3, 5, 7, 'lm', null),
(4, 5, null, '建議新嘅金剛棒update返欠債alex柒事', null);
