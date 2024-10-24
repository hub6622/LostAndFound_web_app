import request from '@/utils/request.js'

// 获取所有 item 列表
export const itemListService = () => {
    return request.get('/item/list')
}

// 根据类别获取 item 列表
export const itemListByCategoryService = (cate) => {
    return request.get('/item/getItemByCategory/' + cate)
}

// 通过 ID 获取 item 详情
export const itemListByIdService = (id) => {
    return request.get('/item/getItemById/' + id)
}

// 获取某个 item 的评论列表
export const commentsByItemIdService = (id) => {
    return request.get('/item/commentsByItemId/' + id)
}

// 添加 item 评论
export const addCommentService = (params) => {
    return request.post('/item/addItemComment', params)
}

// 添加 item 评论回复
export const addCommentReplyService = (params) => {
    return request.post('/item/addItemCommentReply', params)
}

// 新增一个 item
export const addItemService = (params) => {
    return request.post('/item/addItem', params)
}
export const updateItemService = (params) => {
    return request.post('/item/updateItem', params)
}
// 更新 item 的浏览次数
export const updateItemViewCountService = (itemId) => {
    return request.post('/item/updateItemViewCounts/' + itemId)
}

// 获取所有分类
export const getCategoryService = () => {
    return request.get('/item/getCategory')
}

// 获取热门 item
export const hotItemService = () => {
    return request.get('/item/hotItem')
}

// 获取用户发布的 item
export const getItemByUserService = () => {
    return request.get('/item/getItemByUser')
}

// 删除 item
export const deleteItemService = (itemId) => {
    return request.post('/item/deleteItem', {itemId: itemId})
}

export const sendContactService = (params)=>{
    return request.post('/item/sendContact',params)
}
export const getNewestListService = ()=>{
    return request.get('/item/newestList')
}

export const searchItemService = (params)=>{
    return request({
        url:"/item/getItemByParams",
        method:"get",
        params
    })
}
