<template>
  <div class="header">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        background-color="#696969"
        text-color="#fff"
        active-text-color="#00BFFF"
    >
      <el-menu-item index="1" @click="router.push('/item/showItem')">首页</el-menu-item>
      <el-menu-item index="2"><router-link :to="'/controlItem'">我的发布</router-link></el-menu-item>
      <el-menu-item index="3" @click="pushTo('/item/addItem')">发布</el-menu-item>
      <el-menu-item index="4" @click="router.push('/item/category/失物')">全部失物</el-menu-item>
      <el-menu-item index="5" @click="router.push('/item/category/招领')">全部拾得</el-menu-item>
      <el-menu-item index="6">
        <a href="https://github.com/hub6622/LostAndFound_web_app" target="_blank">关于本站</a>
      </el-menu-item>
      <div class="right-aligned-container">
        <el-menu-item index="7" v-if="isAdmin()"><a href="http://localhost:3333" style="color: whitesmoke">管理员页面</a></el-menu-item>
        <el-menu-item index="8">
          <el-input
              v-model="searchTitle"
              style="width: 240px"
              size="small"
              placeholder="请输入搜索内容"
              @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon @click="handleSearch" class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-menu-item>
        <el-menu-item style="font-size: 20px">用户：{{userInfo ? userInfo.name : '未登录'}}</el-menu-item>
        <el-menu-item v-if="userInfo">
          <message-center-vue :userInfo="userInfo"/>
        </el-menu-item>
        <el-menu-item v-if="!userInfo"><router-link to="/login" style="color: whitesmoke">登录/注册</router-link></el-menu-item>
        <el-sub-menu index="9">
          <template #title>账号安全</template>
          <el-menu-item index="9-1"><router-link to="/userSecurity" style="color: whitesmoke">修改密码</router-link></el-menu-item>
          <el-menu-item @click="logOut">退出登录</el-menu-item>
        </el-sub-menu>
      </div>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem, ElMessage, ElInput, ElIcon } from 'element-plus';
import { ref, watch } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.js';
import { useTokenStore } from '@/stores/token.js';
import router from '@/router/router';
import messageCenterVue from '@/components/messageCenter.vue';
import { Search } from '@element-plus/icons-vue';

interface UserInfo {
  name: string;
  nickname: string;
  avatar: string;
  biography: string;
  phone: string;
  email: string;
  sex: string;
  isAdmin: number;
}

const userInfoStore = useUserInfoStore();
const tokenStore = useTokenStore();
const userInfo = ref<UserInfo | null>(userInfoStore.info || null);
const searchTitle = ref('');
const logOut = () => {
  userInfoStore.removeInfo();
  tokenStore.removeToken();
  router.push({ path: '/item/showItem' });
};
const activeIndex = ref('1');

watch(() => userInfoStore.info, (newValue) => {
  userInfo.value = newValue || null;
});

const isAdmin = () => {
  if (userInfo.value && userInfo.value.isAdmin !== undefined) {
    return userInfo.value.isAdmin === 1;
  }
  return false;
};

const handleSearch = () => {
  if (searchTitle.value.trim() !== '') {
    router.push({ path: '/item/search/' + searchTitle.value });
  } else {
    ElMessage.warning('请输入搜索内容');
  }
};

const pushTo = (path) => {
  if (userInfo.value) {
    router.push({ path: path });
  } else {
    ElMessage.error('未登录，请先登录');
    router.push('/login');
  }
};
</script>



<style lang="scss" scoped>
.header {
  width: 100%;
  background-color: #1E90FF;
}
.right-aligned-container {
  float: right;
  display: flex;
  align-items: center;
}

.search-icon {
  cursor: pointer;
}
a {
  text-decoration: none;
}

.el-menu-demo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-aligned-container {
  display: flex;
  margin-left: auto;
}
</style>
