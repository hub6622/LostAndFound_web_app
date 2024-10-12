<template>
  <div class="sidebar">
    <el-aside>
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">展开</el-radio-button>
        <el-radio-button :value="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          :default-openeds="['3']"
      >
        <el-menu-item index="1">
          <el-icon>
            <HomeFilled/>
          </el-icon>
          <template #title>
            <router-link :to="'/'">返回主页
            </router-link>
          </template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <IconMenu/>
            </el-icon>
            <span>失物分类</span>
          </template>
          <el-menu-item-group>
            <template #title><span>语言</span></template>
            <el-menu-item v-for="(item, index) in categoryList" :key="index">
              <router-link :to="'/item/category/'+item">
                {{ item }}
              </router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <IconMenu/>
            </el-icon>
            <span>失物推荐</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(item, index) in itemList" :key="index">
              <a style="width: 100%;" href="#" @click.prevent="pushTo(item)">{{ item.title }}</a>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, onMounted} from 'vue';
import {HomeFilled, Document, Menu as IconMenu, Location, Setting} from '@element-plus/icons-vue';
import {getCategoryService, hotItemService} from '@/api/item';
import router from '@/router/router.js';

const isCollapse = ref(false);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const categoryList = ref([]);
const itemList = ref([]);
const pushTo = (item) => {
  router.push({path: `/item/main/${item.id}`});
};
onMounted(async () => {
  let result = await getCategoryService();
  let result2 = await hotItemService();
  itemList.value = result2.data;
  categoryList.value = result.data;
});
</script>

<style scoped>
.sidebar {
  overflow-y: auto;
  position: fixed;
  top: 100px;
  right: 100px;
}
a {
  text-decoration: none;
  color: black;
}
.item-text a {
  font-size: 17px;
  color: palevioletred;
}
</style>
