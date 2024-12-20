import request from '@/utils/request.js'

export const userLoginService = (users) => {
   return request.post('/user/login', users);
}
export const userRegisterService = (users) => {
    return request.post('/user/register', users);
}
export const userInfoService = () => {
    return request.get('/user/info')
}
export const getUserCommentService = () => {
    return request.get('/user/getUserComment')
}
export const userCommentDeleteService = (id,itemId) => {
    return request.post('/user/commentDelete',{id:id,itemId:itemId})
}

export const userReplyDeleteService = (id) => {
    return request.post('/user/replyDelete',{id:id})
}
export const updateUserInfoService = (params)  => {
    return request.post('/user/updateUserInfo',params)
}
export const confirmPasswordService = (pwd) => {
    return request.post('/user/confirmPwd',{pwd:pwd})
}
export const updateAvatarService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl);
    return request.patch('/user/updateAvatar',params)
}

export const getUserNoticeService = () => {
    return request.get('/user/getNotice')
}

export const confirmNoticeService = (params) => {
    return request.post('/user/confirmNotice',params);
}

export const getNoticeHistoryService = () => {
    return request.get('/user/getNoticeHistory')
}
export const changePasswordService = (params)=>{
    return request.post('/user/changePassword',params)
}