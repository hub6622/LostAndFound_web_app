import { createRouter, createWebHistory } from 'vue-router';
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import itemCategory from '@/views/item/category.vue'; // 修改路径
import itemMain from '@/views/item/itemMain.vue'; // 修改路径
import addItem from '@/views/item/editItem.vue'; // 修改路径
import controlItem from '@/views/user/controlItem.vue'; // 修改路径
import userInfo from '@/views/user/userInfo.vue';

const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        redirect: '/item/category', // 修改重定向路径
        component: LayoutVue,
        children: [
            { path: '/item/category/:cate', component: itemCategory }, // 修改路径
            { path: '/item/category', component: itemCategory }, // 修改路径
            { path: '/item/main/:itemId', name: 'itemMain', component: itemMain }, // 修改路径和参数名
            { path: '/item/addItem', component: addItem }, // 修改路径
            { path: '/controlItem', component: controlItem }, // 修改路径
            { path: '/item/editItem/:itemId', component: addItem }, // 修改路径和参数名
            { path: '/userInfo', component: userInfo },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
