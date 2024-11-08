<template>
  <div class="login">
    <div class="login-box">
      <el-form
          :label-position="'top'"
          ref="ruleFormRef"
          style="max-width: 400px"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          v-if="isRegister"
      >
        <h1>注册</h1>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="密码" />
        </el-form-item>
        <el-form-item prop="rePass">
          <el-input v-model="ruleForm.rePass" type="password" autocomplete="off" placeholder="确认密码" />
        </el-form-item>
        <el-form-item prop="sex">
          <el-select v-model="ruleForm.sex" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-avatar :size="120" shape="square" :src="ruleForm.avatar" />
          <el-upload
              ref="uploadRef"
              :show-file-list="false"
              :auto-upload="true"
              action="/api/upload"
              name="file"
              :headers="{'Authorization': token}"
              :on-success="uploadSuccess"
          >
            <el-button style="margin-left: 20px" class="mid-btn" type="success">
              选择头像
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-link type="info" @click="goLogin">
            前往登录 ->
          </el-link>
          <el-button class="right-btn" type="primary" @click="submitForm('register')">
            注册
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
      <el-form
          :label-position="'top'"
          ref="ruleFormRef"
          style="max-width: 400px"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          autocomplete="off"
          v-else
      >
        <h1>登录</h1>
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="密码" />
        </el-form-item>
        <el-form-item>
          <el-link type="info" @click="goRegister">
            前往注册 ->
          </el-link>
          <el-button class="right-btn" type="primary" @click="submitForm('login')">
            登录
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
      <span>我是管理员，前往登录</span>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessage } from "element-plus"
import router from "@/router/router"
import { useTokenStore } from "@/stores/token"

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const useToken = useTokenStore()
const token = useToken.token
const ruleForm = reactive({
  name: '',
  password: '',
  rePass: '',
  avatar: '',
  sex: ''
})

// 自定义表单校验通过validator使用
const confirmRePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

const uploadSuccess = (result) => {
  ruleForm.avatar = result.data
  ElMessage.success("上传头像成功")
}

// eP自带表单校验
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '请输入3-8位用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 16, message: '密码8-16位', trigger: 'blur' },
  ],
  rePass: [
    { validator: confirmRePass, trigger: 'blur' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
})

// isRegister确认是注册表单还是登录表单，可自动跳转登录
const isRegister = ref(false)
const goLogin = () => {
  isRegister.value = false
}
const goRegister = () => {
  ruleForm.name = ''
  ruleForm.password = ''
  ruleForm.rePass = ''
  isRegister.value = true
}

import { userRegisterService, userLoginService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { userInfoService } from '@/api/user.js'

const useUserInfo = useUserInfoStore()
const tokenStore = useTokenStore()
const getUserInfo = async () => {
  let result = await userInfoService()
  useUserInfo.setInfo(result.data)
}

const submitForm = async (action: 'login' | 'register') => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (action === 'login') {
        login()
      } else if (action === 'register') {
        register()
      }
    } else {
      ElMessage.error('表单验证未通过，请检查输入')
    }
  })
}

const login = async () => {
  const result = await userLoginService(ruleForm) as any
  if (result.code === 200) {
    ElMessage.success(result ? result.msg : "登录成功")
    tokenStore.setToken(result.data)
    await getUserInfo()
    router.push('/')
  } else {
    ElMessage.error(result ? result.msg : "登录失败")
  }
}

const register = async () => {
  const result = await userRegisterService(ruleForm) as any
  ElMessage.success(result ? result.msg : "注册成功")
  isRegister.value = false
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.login {
  top: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(../statis/2487904243.jpg);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-box {
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px pink;
  width: 400px;
  background-color: white;
  padding: 40px;
  box-sizing: border-box;
}

.login-box h1 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 30px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-button {
  margin-right: 15px;
}

.right-btn {
  margin-left: auto;
}

.el-avatar {
  margin-bottom: 20px;
}

.mid-btn {
  margin-top: 15px;
}

/deep/ .el-form-item.is-success .el-input__inner{
  border-color: green;
}
/deep/ .el-form-item.is-success .el-input__validateIcon{
  color: green;
}
/deep/ .el-form-item__success{
  color: green;
}
</style>

