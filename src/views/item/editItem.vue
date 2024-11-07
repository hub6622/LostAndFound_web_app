<template>
  <div style="display: flex; flex-direction: column; margin-left: 250px">
    <el-form ref="formRef" :model="item" :rules="rules" label-width="120px">
      <el-form-item label="请输入标题" prop="title">
        <el-input v-model="item.title" placeholder="请输入文章标题" class="input-title"></el-input>
      </el-form-item>
      <el-form-item label="物品种类" prop="categories">
        <el-select v-model="item.categories" multiple placeholder="请选择分类" class="input-title">
          <el-option v-for="category in categoryList" :key="category.id" :label="category.categoryName" :value="category.categoryName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="失拾情况" prop="lostOrFound">
        <el-select v-model="item.lostOrFound" style="display: block" placeholder="Select" class="input-title">
          <el-option :label="'拾物'" :value="0"/>
          <el-option :label="'失物'" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="物品图片" prop="picUrl">
        <div style="display: flex; flex-direction: column;">
          <el-avatar :size="350" shape="square" :src="item.picUrl" style="margin-top: 10px;"></el-avatar>
          <el-upload
              ref="uploadRef"
              :show-file-list="false"
              :auto-upload="true"
              action="/api/upload"
              name="file"
              :headers="{'Authorization': token}"
              :on-success="uploadSuccess"
              style="margin-top: 10px;"
          >
            <el-button class="mid-btn" type="success">
              选择图片
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="请输入内容描述" prop="content">
        <el-input v-model="item.content" type="textarea" placeholder="请输入内容描述" class="input-title" :rows="5"></el-input>
      </el-form-item>
      <div class="button-wrapper">
        <el-button type="primary" @click="submitForm" v-if="isAddItem">提交</el-button>
        <el-button type="primary" @click="editForm" v-else>修改</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { addItemService, getCategoryService, itemListByIdService, updateItemService } from "@/api/item";
import { useRoute } from "vue-router";
import router from "@/router/router";
import { ElMessage, FormInstance } from "element-plus";
import { useTokenStore } from "@/stores/token";

const formRef = ref<FormInstance>();

const route = useRoute();
const tokenStore = useTokenStore();

interface Item {
  id: number;
  title: string;
  categories: string[];
  content: string;
  picUrl: string;
  lostOrFound: number;
}

interface CategoryData {
  id: number;
  categoryName: string;
  updateTime: string;
  createTime: string;
}

const item = ref<Item>({
  id: 0,
  title: '',
  categories: [],
  content: '',
  picUrl: '',
  lostOrFound: 1
});

const isAddItem = ref(true);
const categoryList = ref<CategoryData[]>([]);
const token = ref(tokenStore.token);

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  categories: [{ required: true, message: '请选择物品种类', trigger: 'change' }],
  lostOrFound: [{ required: true, message: '请选择失拾情况', trigger: 'change' }],
  picUrl: [{ required: true, message: '请上传物品图片', trigger: 'change' }]
};

const getCategory = async () => {
  let result = await getCategoryService();
  categoryList.value = result.data;
  if (route.path !== '/item/addItem') {
    isAddItem.value = false;
    getItemById();
  }
};

getCategory();

const getItemById = async () => {
  let result = await itemListByIdService(route.params.itemId as string);
  item.value = result.data;
};

watch(() => route.path, (newValue, oldValue) => {
  if (newValue === '/item/addItem') {
    item.value = {
      id: 0,
      title: '',
      categories: [],
      content: '',
      picUrl: '',
      lostOrFound: 1
    };
    isAddItem.value = true;
  }
});

const submitForm = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      await addItemService(item.value);
      ElMessage.success("发布物品信息成功");
      router.push('/');
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};

const uploadSuccess = (result) => {
  item.value.picUrl = result.data;
  ElMessage.success("上传图片成功");
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  item.value = {
    id: 0,
    title: '',
    categories: [],
    content: '',
    picUrl: '',
    lostOrFound: 1
  };
};

const editForm = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      await updateItemService(item.value);
      ElMessage.success("修改物品信息成功");
      router.push('/controlItem');
    } else {
      ElMessage.error("表单验证失败，请检查输入");
    }
  });
};
</script>

<style scoped>
.input-title {
  width: 700px;
  margin-bottom: 20px;
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  width: 250px;
  height: 50px;
  margin: 10px auto;
}

.mid-btn {
  width: 400px;
  float: left;
}
</style>
