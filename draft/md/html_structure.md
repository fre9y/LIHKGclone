<> == non click event

# Hidden navigation slide(class = offcanvas)
## left-side(button bar):
    - Navbar button (class = btn-bar)
        lihkg icon, bell, user, game center, themes, setting
## right-side(button bar & stations)(class = offcanvas-container):
    - search input, review post, log-in/sign-up (class = offcanvas-hd)
    - all station(class = offcanvas-bd)


## left side:
## top
    - Navbar button (class = navbar_btn)
    - <where:WhichStationCurrently> (class = station_name)
    - Refresh button (class = refresh_btn)
    - Create Post button (class = create_post_btn)
## bottom 
    - latest btn, hit btn(class = latest_btn)
    - latest post (class = latest_post)

## N Rows = Posts
(post-wrapper) wrap line1 and line2
Line1
- <Username> (class = nickname)
- <Time> (class = last-reply-time)
- <Likes/Dislikes> (class = like-dislike-sum)
- page: toggle page number button (class = navigate-page-btn, span = last-page-number)
Line2
- <PostName> (class = post-name, id = post-name.id)
- <where:WhichStationThatPostAt> button (class = station-name, id = station-name.id)

# Right side
## Initial HTML
### First Row
- LIHKG icon <img>
- LIHKG 討論區 <text>
### Second Row
- <img> https://cdn.lihkg.com/assets/img/hot-reply.png
### Third Row
- 手機用戶可以下載官方 LIHKG 應用程式 <text>
### Forth Row
- iOS 應用程式 <href> https://apps.apple.com/hk/app/lihkg-tao-lun-qu/id1178373396
- Android 應用程式 <href> https://play.google.com/store/apps/details?id=com.lihkg.app


## Post (class = post-wrapper)
## First Row: (class = post-header-container)
- Lastpage link button (class = last-link-btn)
- <PostName>
- Starred Button (class = create-star-btn)
- Reply Button (no quote) (class = create-no-quote-reply-btn)
- Like Button (class = like-btn)
- Dislike Button (class = dislike-btn)
(One is on then another cannot be activated) 
- Media (class = media-mode-btn)
- Sorting by likes (class = sort-by-likes-btn)
- Share (Optional) (class = share-btn)

## FIXED POSITION BELOW FIRST ROW 
- (class = pinned-message-wrapper)
- left side: information icon
- right side:
- row1: 樓主置頂 <text> + reply number
- row2: <Text>


## Second Row: (class = page-number-container) (will repeat)
- page: toggle page number (class = navigate-page-btn, span = last-page-number)
- Last Page Button  (class = last-page-btn)
- Next Page Button  (class = next-page-btn)

# Reply Box (class = reply-box-wrapper)
Line1 (class = reply-header)
- <ReplyNumber>
- Username
- Posting Time
- Story Mode (Optional : only show that user reply)
- quote that reply box to reply (class = create-quote-reply-btn)
- Share (optional) (class = share-btn)
Line2 (class= reply-content)
- <TextContent>
Line3 (class = reply-footer)
- Like Button
- Dislike Button
- Comment Button

# Navbar
LEFT SIDE : class = navbar-left-wrapper
<br></br>
RIGHT SIDE : class = navbar-right-wrapper
## /NotLoggedIn
class = non-member-function-container
- Search
- Login
- Rewind
### All stations:
- class = main-station-container
- class = news-station-container
- class = tech-station-container
- class = living-station-container
- class = hobby-station-container
- class = other-station-container

## /IsLoggedIn
class = member-function-container
- Search
- Rewind posts
- Following Users'posts
- Replies Created
- Starred posts

### All stations:
- class = main-station-container
- class = news-station-container
- class = tech-station-container
- class = living-station-container
- class = hobby-station-container
- class = other-station-container
