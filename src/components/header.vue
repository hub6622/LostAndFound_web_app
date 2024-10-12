<template>
  <div class="header">
  <el-row>
    <el-col :span="18">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2"><router-link :to="'/controlItem'">我的发布</router-link></el-menu-item>
        <el-menu-item index="3"><router-link :to="'/item/addItem'">失物发布</router-link></el-menu-item>
        <el-menu-item index="4">
          <a href="https://github.com/hub6622/LostAndFound_web_app" target="_blank">关于本站</a>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="6">
      <el-menu
          background-color="#545c64"
          text-color="#fff"
          mode="horizontal"
          width="100%"
      >
        <el-menu-item>
          <span>消息提醒</span>
        </el-menu-item>
        <el-menu-item>
          <el-avatar v-if="userInfo" :size="50" shape="square" :src="userInfo?userInfo.avatar:null" />
        </el-menu-item>
        <el-menu-item>用户：{{userInfo?userInfo.name:'未登录'}}</el-menu-item>
        <el-menu-item v-if="!userInfo"><router-link to="/login">登录/注册</router-link></el-menu-item>
        <el-menu-item v-if="userInfo"><router-link to="/userInfo">个人信息</router-link></el-menu-item>
        <el-menu-item v-if="userInfo" @click="logOut">退出登录</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus';
import {ref, watch} from 'vue'
import {useUserInfoStore} from "@/stores/userInfo.js"
import {useTokenStore} from "@/stores/token.js"
import router from "@/router/router";

interface UserInfo {
  name:string,
  avatar:string
}
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const userInfo=ref<UserInfo>(userInfoStore.info)
const logOut = () => {
  userInfoStore.removeInfo()
  tokenStore.removeToken()
  router.push({path:"/"})
}
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  if (key === '1'){
    router.push("/")
  }else if(key === '2') {
    router.push("/controlItem")
  }else if(key === '3') {
    router.push("/item/addItem")
  }
}
watch( () => userInfoStore.info, (newValue) => {
  userInfo.value = newValue
})
</script>

<style lang="scss" scoped>
.header{
  width: 100%;
  background-color: #545c64;
}
a{
  text-decoration: none;
}
</style>