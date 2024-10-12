<template>
  <div style="width: 100%; min-height: 1000px">
    <el-card style="max-width: 100%">
      <template #header>
        <div class="card-header">
          <span>文章</span>
        </div>
      </template>
      <el-table :data="itemList" style="width: 100%">
        <el-table-column prop="title" label="标题" width="250"/>
        <el-table-column prop="author.name" label="作者" width="100"/>
        <el-table-column prop="category" label="类别" width="100"/>
        <el-table-column prop="viewCounts" label="浏览量" width="100"/>
        <el-table-column prop="commentCounts" label="评论量" width="100"/>
        <el-table-column prop="createTime" label="发布时间"/>
        <el-table-column prop="id">
          <template v-slot="{row}">
            <el-button class="optBtn"
                       type="danger" icon="el-icon-delete" circle
                       @click.prevent="itemDel(row.id)">
              <Delete style="width: 1em; height: 1em; margin-right: 8px"></Delete>
            </el-button>
            <el-button class="optBtn"
                       type="warning"
                       icon="el-icon-edit" circle
                       @click.prevent="itemEdit(row.id)">
              <Edit style="width: 1em; height: 1em; margin-right: 8px"/>
            </el-button>
            <el-button class="optBtn"
                       type="primary"
                       icon="el-icon-edit" circle
                       @click.prevent="pushTo(row.id)">
              <View style="width: 1em; height: 1em; margin-right: 8px"/>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <control-comment-vue ref="commentRef"/>
  </div>
</template>

<script setup>
import controlCommentVue from "@/views/user/controlComment.vue";
import router from "@/router/router.js";
import {getItemByUserService, deleteItemService} from "@/api/item.js";
import {ElMessage} from "element-plus";
import {ref, watch} from "vue";
import {Delete, View} from "@element-plus/icons-vue";

const itemList = ref([]);
const commentRef = ref(null);

const pushTo = (id) => {
  router.push({path: "/item/main/" + id});
};

const getItemList = async () => {
  let result = await getItemByUserService();
  itemList.value = result.data;
};
getItemList();

const itemDel = async (id) => {
  await deleteItemService(id);
  ElMessage.success("删除成功");
  await getItemList();
  await commentRef.value.getCommentList();
};

const itemEdit = (id) => {
  router.push({path: "/item/editItem/" + id});
};
</script>

<style scoped>
</style>
