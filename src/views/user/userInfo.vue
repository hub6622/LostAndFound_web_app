<template>
  <div style="height:100%;min-height: 1000px;width: 1000px; margin: 0 auto;">
    <el-card style="max-width: 800px;margin: 0 auto;">
      <template #header>
        <div class="card-header">
          <span style="font-size: 29px">用户信息</span>
        </div>
      </template>
      <el-row>
        <el-col :span="12">
          <el-form
              :label-position="'top'"
              ref="ruleFormRef"
              style="max-width: 300px"
              :model="userInfo"
              :rules="rules"
              label-width="auto"
              class="demo-ruleForm"
              :size="formSize"
              status-icon
              autocomplete="off"
          >
            <el-form-item prop="name">
              <span>用户名:(用户名唯一不可修改)</span>
              <el-input placeholder="用户名" disabled v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item prop="gender">
              <span>性别:</span>
              <el-select v-model="userInfo.sex" placeholder="请选择">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="email">
              <span>邮箱:</span>
              <el-input type="text" placeholder="邮箱" v-model="userInfo.email"/>
            </el-form-item>
            <el-form-item prop="phone">
              <span>手机号:</span>
              <el-input type="number" placeholder="手机号" v-model="userInfo.phone"/>
            </el-form-item>
            <el-form-item prop="biography">
              <span>个人简介:</span>
              <el-input type="textarea" placeholder="个人简介" v-model="userInfo.biography" rows="3"/>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left: 80px;" type="primary" @click="changeUserInfo">
                修改
              </el-button>
              <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-avatar :size="350" shape="square" :src="imgUrl"/>
          <el-upload
              ref="uploadRef"
              :show-file-list="false"
              :auto-upload="true"
              action="/api/upload"
              name="file"
              :headers="{'Authorization':token}"
              :on-success="uploadSuccess"
          >
            <el-button class="mid-btn" type="success">
              选择头像
            </el-button>
          </el-upload>
          <el-button class="mid-btn" type="primary" @click="changeUserAvatar">
            确认修改
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>


</template>

<script setup lang="ts">
import {useTokenStore} from "@/stores/token"
import {useUserInfoStore} from "@/stores/userInfo"
import {updateUserInfoService, updateAvatarService, userInfoService} from "@/api/user"
import {reactive, ref} from "vue";
import {type ComponentSize, ElMessage, FormInstance, type FormRules} from "element-plus";

interface UserInfo {
  id: number;
  name: string;
  password: string;
  phone: string;
  email: string;
  avatar: string;
  newPassword: string;
  reNewPassword: string;
  biography: string;
  sex: number;
}
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const userInfo = ref<UserInfo>({
  id: 0,
  name: '',
  password: '',
  email: '',
  avatar: '',
  newPassword: '',
  reNewPassword: '',
  phone: '',
  biography: '',
  sex: 0
})
const token = ref(tokenStore.token)
const imgUrl = ref(userInfoStore.info.avatar)
const getUserInfo = async () => {
  const result = await userInfoService();
  userInfo.value = result.data;
}
getUserInfo()
// 自定义表单校验通过validator使用

// eP自带表单校验
const rules = reactive<FormRules>({
  name: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 8, message: '请输入3-8位用户名', trigger: 'blur'},
  ],
  email: [
    {required: false, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
  ],
  phone: [
    {required: false, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change']}
  ]
})
const changeUserInfo = async () => {
  await updateUserInfoService({
    phone: userInfo.value.phone,
    email: userInfo.value.email,
    id: userInfo.value.id,
    biography: userInfo.value.biography,
    sex: userInfo.value.sex
  });
  const result = await userInfoService()
  userInfoStore.setInfo(result.data)
  ElMessage.success("修改用户信息成功")
}
const changeUserAvatar = async () => {
  await updateAvatarService(imgUrl.value);
  ElMessage.success("修改头像成功")
  userInfoStore.info.avatar = imgUrl.value;
}
const uploadSuccess = (result) => {
  imgUrl.value = result.data;
  ElMessage.success("上传头像成功")
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.mid-btn {
  margin-left: 100px;
  margin-top: 10px;
  width: 150px;
}
</style>