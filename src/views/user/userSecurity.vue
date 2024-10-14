<template>
  <div class="rePassContainer">
    <el-form
        :label-position="'top'"
        ref="ruleFormRef"
        style="max-width: 300px"
        :model="userInfo"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="'default'"
        status-icon
        autocomplete="off"
    >
      <el-form-item prop="password">
        <span>原密码:</span>
        <el-input type="password" v-model="userInfo.password" autocomplete="off" placeholder="请输入原密码"/>
      </el-form-item>
      <el-form-item prop="newPassword">
        <span>新密码:</span>
        <el-input type="password" v-model="userInfo.newPassword" autocomplete="off" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item prop="reNewPassword">
        <span>确认新密码:</span>
        <el-input type="password" v-model="userInfo.reNewPassword" autocomplete="off" placeholder="确认新密码"/>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 80px;" type="primary" @click="changePassword">
          修改
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {confirmPasswordService, changePasswordService, userInfoService} from "@/api/user.js";
import {reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useUserInfoStore} from "@/stores/userInfo"

const userInfoStore = useUserInfoStore()
interface UserInfo {
  id: number,
  name: string,
  password: string,
  email: string,
  avatar: string,
  newPassword: string,
  reNewPassword: string
}
const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  password: '',
  email: '',
  avatar: '',
  newPassword: '',
  reNewPassword: '',
})
const ruleFormRef = ref<FormInstance>()
const getUserInfo = async () => {
  const result = await userInfoService();
  userInfo.value = result.data;
}
getUserInfo()
const confirmRePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== userInfo.value.newPassword) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}
const confirmRealPass = async (rule, value, callback) => {
  const result = await confirmPasswordService(value);
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else if (!result.data) {
    callback(new Error('密码错误'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  password: [
    {asyncValidator: confirmRealPass, trigger: 'blur', required: false}
  ],
  newPassword: [
    {required: false, message: '请输入新密码', trigger: 'blur'},
    {min: 8, max: 16, message: '请输入8-16位密码', trigger: 'blur'},
  ],
  reNewPassword: [
    {validator: confirmRePass, trigger: 'blur', required: false}
  ]
})
const changePassword = async () => {
  await changePasswordService({
    password: userInfo.value.newPassword,
  });
  ElMessage.success("修改密码成功")
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.rePassContainer{
  margin: 100px auto 0;
}
</style>