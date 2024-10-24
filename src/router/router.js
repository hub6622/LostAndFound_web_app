import { createRouter, createWebHistory } from 'vue-router';
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import itemCategory from "@/views/item/category.vue";
import itemMain from '@/views/item/itemMain.vue';
import addItem from '@/views/item/editItem.vue';
import controlItem from '@/views/user/controlItem.vue';
import userInfo from '@/views/user/userInfo.vue';
import userSecurity from '@/views/user/userSecurity.vue'
import showItem from '@/views/item/showItem.vue';

const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/',
        redirect: '/item/showItem', // 修改重定向路径
        component: LayoutVue,
        children: [
            { path: '/item/showItem', component: showItem }, // 修改路径
            { path: '/item/main/:itemId', name: 'itemMain', component: itemMain }, // 修改路径和参数名
            { path: '/item/addItem', component: addItem }, // 修改路径
            { path: '/controlItem', component: controlItem }, // 修改路径
            { path: '/item/editItem/:itemId', component: addItem }, // 修改路径和参数名
            { path: '/userInfo', component: userInfo },
            { path: '/userSecurity', component: userSecurity },
            { path: '/item/category', component: itemCategory},
            { path: '/item/category/:cate', component: itemCategory},
            { path: '/item/search/:cate', component: itemCategory}
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
