<template>
  <div style="display: flex; flex-direction: column; margin-left: 250px">
    <span style="font-size: 29px">请输入标题</span>
    <el-input v-model="item.title" placeholder="请输入文章标题" class="input-title"></el-input>
    <span style="font-size: 29px">物品种类</span>
    <el-select v-model="item.category" placeholder="Select" class="input-title">
      <el-option v-for="item in categoryList" :key="item" :label="item" :value="item"/>
    </el-select>
    <span style="font-size: 29px">失拾情况</span>
    <el-select v-model="item.lostOrFound" style="display: block" placeholder="Select" class="input-title">
      <el-option :label="'拾物'" :value="0"/>
      <el-option :label="'失物'" :value="1"/>
    </el-select>
    <span style="font-size: 29px">物品图片</span>
    <el-avatar :size="350" shape="square" :src="item.picUrl" style="margin-top: 10px"/>
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
        选择图片
      </el-button>
    </el-upload>
    <span style="font-size: 29px">请输入内容描述</span>
    <el-input v-model="item.content" type="textarea" placeholder="请输入内容描述" class="input-title"
              :rows="5"></el-input>
    <div class="button-wrapper">
      <el-button type="primary" @click="uploadItem" v-if="isAddItem">提交</el-button>
      <el-button type="primary" @click="editItem" v-else>修改</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {addItemService, getCategoryService, itemListByIdService, updateItemService} from "@/api/item"
import {useRoute} from "vue-router"
import router from "@/router/router"
import {ElMessage, FormInstance} from "element-plus";
import {useTokenStore} from "@/stores/token"

const route = useRoute()
const tokenStore = useTokenStore()

interface Item {
  id: number;
  title: string;
  category: string;
  content: string;
  picUrl: string;
  lostOrFound: number
}

const item = ref<Item>({
  id: 0,
  title: '',
  category: '',
  content: '',
  picUrl: '#',
  lostOrFound: 1
})
const isAddItem = ref(true)
const categoryList = ref([])
const isLostOrFound = ref(false)
const token = ref(tokenStore.token)
const getCategory = async () => {
  let result = await getCategoryService()
  categoryList.value = result.data
  if (route.path != '/item/addItem') {
    isAddItem.value = false
    getItemById()
  }
}
getCategory()

const getItemById = async () => {
  let result = await itemListByIdService(route.params.itemId as string);
  item.value = result.data;
}
watch(() => route.path, (newValue, oldValue) => {
  if (newValue === '/item/addItem') {
    item.value = {
      id: 0,
      title: '',
      category: '',
      content: '',
      picUrl: '#',
      lostOrFound: 1
    }
    isAddItem.value = true
  }
})

const uploadItem = async () => {
  await addItemService(item.value)
  ElMessage.success("发布物品信息成功")
  router.push('/')
}
const uploadSuccess = (result) => {
  item.value.picUrl = result.data;
  ElMessage.success("上传图片成功")
}
const resetForm = () => {
  item.value = {
    id: 0,
    title: '',
    category: '',
    content: '',
    picUrl: '#',
    lostOrFound: 1
  }
}
const editItem = async () => {
  await updateItemService(item.value)
  ElMessage.success("修改物品信息成功")
  router.push('/controlItem')
}
</script>

<style scoped>
.input-title {
  width: 700px;
}

.mid-btn {
  width: 400px;
  margin-top: 10px;
}

.button-wrapper {
  width: 250px;
  height: 50px;
  margin: 10px auto;
}
</style>
