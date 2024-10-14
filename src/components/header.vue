<template>
  <div class="header">
  <el-row>
    <el-col :span="16">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="1" @click="pushTo('/')">首页</el-menu-item>
        <el-menu-item index="2"><router-link :to="'/controlItem'">我的发布</router-link></el-menu-item>
        <el-menu-item index="3" @click="pushTo('/item/addItem')">失物发布</el-menu-item>
        <el-menu-item index="4">
          <a href="https://github.com/hub6622/LostAndFound_web_app" target="_blank">关于本站</a>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="8">
      <el-menu
          background-color="#545c64"
          text-color="#fff"
          mode="horizontal"
      >
        <el-menu-item style="font-size: 20px">用户：{{userInfo?userInfo.name:'未登录'}}</el-menu-item>
        <el-menu-item v-if="userInfo">
          <message-center-vue :userInfo="userInfo"/>
        </el-menu-item>

        <el-menu-item v-if="!userInfo"><router-link to="/login">登录/注册</router-link></el-menu-item>
        <el-sub-menu index="5">
          <template #title>账号安全</template>
          <el-menu-item index="5-1"><router-link to="/userSecurity" style="color: whitesmoke">修改密码</router-link></el-menu-item>
          <el-menu-item @click="logOut">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
  </div>
</template>

<script setup lang="ts">
import {ElMenu, ElMenuItem, ElMessage} from 'element-plus';
import {ref, watch} from 'vue'
import {useUserInfoStore} from "@/stores/userInfo.js"
import {useTokenStore} from "@/stores/token.js"
import router from "@/router/router";
import messageCenterVue from "@/components/messageCenter.vue"
interface UserInfo {
  name: string
  nickname: string
  avatar: string
  biography: string
  phone: string
  email: string
  sex: string
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

watch( () => userInfoStore.info, (newValue) => {
  userInfo.value = newValue
})

const pushTo = (path) => {
  if(userInfo.value){
    router.push({path: path})
  }else {
    ElMessage.error("未登录，请先登录")
    router.push('/login')
  }
}
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