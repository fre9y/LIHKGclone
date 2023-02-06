//LOGOUT
export async function logout() {
    let res = await fetch('/user/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        alert("[ERR0R: CANT LOGOUT]")
        return
    } else {
        alert("LOGGED OUT")
        window.location = "/"
        return
    }
            
}

export async function showBlockedList() {
    let res = await fetch('/user/block', {
        method: 'GET'
    })
    if (res.ok) {
        let data = await res.json()
        let blockedList = data
        const blockedListDetail = document.querySelector('.blocked_table .second_row');
        const blockedContainer = document.querySelector('.blocked_table_div');

        for (let i = 0; i < blockedList.length; i++) {
            console.log(blockedList)
            const blockedListClone = blockedListDetail.cloneNode(true);
            let blockedUser = blockedList[i]
            let blockedUserId = blockedUser.user_id_being_blocked
            let blockedUserNickname = blockedUser.nickname
            let createDate = blockedUser.created_at.split('T')[0]
            // let createTime = blockedUser.created_at.split('T')[1].split('.')[0]

            blockedListClone.querySelector('.blocked_id').innerText = blockedUserId;
            blockedListClone.querySelector('.blocked_nickname').innerText = blockedUserNickname;
            blockedListClone.querySelector('.blocked_create_date').innerText = createDate;
            const blockBtn = blockedListClone.querySelector('.unblock_btn');
            blockBtn.addEventListener('click', () => {
                blockedListClone.parentNode.removeChild(blockedListClone)
            })
            blockedContainer.appendChild(blockedListClone);
        }
        blockedListDetail.classList.add('d-none');
    } else {
        // alert("[ERR0R: CANT FETCH]")
        return
    }
}

