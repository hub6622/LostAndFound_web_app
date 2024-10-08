<template>
  <div class="container" style="width: 100%; min-height: 1000px">
    <h2 class="latest-title">最新发布</h2>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in displayedCarouselItems" :key="item.id">
        <a href="#" @click.prevent="pushTo(item)">
          <span class="picHead">{{ item.title }}</span>
          <img :src="item.picUrl" style="width: 100%" />
        </a>
      </el-carousel-item>
    </el-carousel>

    <div class="item_container">
      <el-card v-for="cardItem in displayedCardItems" :key="cardItem.id" class="item_element">
        <img :src="cardItem.picUrl" style="width: 100%; height: 300px;" />
        <template #footer>{{ cardItem.title }}</template>
      </el-card>
    </div>
    <el-pagination
        background
        layout="prev, pager, next"
        :total="itemList.length"
        @current-change="handleCurrentChange"
        :page-size="8"
        :current-page="currentPage"
        :hide-on-single-page="hideIsForT"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import router from '@/router/router.js';
import { useRoute } from 'vue-router';
import { itemListService, itemListByCategoryService } from '@/api/item.js';
import { ElMessage } from 'element-plus';
import pic404 from '@/assets/404pic.jpg';

const hideIsForT = ref(false)
const itemList = ref([
  {
    id: 1,
    title: '标题',
    content: '内容',
    picUrl: pic404,
    category: '类别',
    createTime: '创建时间',
    viewCounts: 1,
    commentCounts: 22,
    author: {
      name: '作者'
    }
  }
]);

const currentPage = ref(1);

const displayedCarouselItems = computed(() => {
  const start = 0;
  const end = 6;
  return itemList.value.slice(start, end);
});

const displayedCardItems = computed(() => {
  hideIsForT.value = itemList.value.length <= 8
  const start = (currentPage.value - 1) * 8;
  const end = start + 8;
  return itemList.value.slice(start, end);
});
const pushTo = (item) => {
  router.push({ path: `/item/main/${item.id}` });
};

const route = useRoute();
const cate = ref(route.params.cate);

watch(() => route.params.cate, (newCate) => {
  if (!newCate || newCate === undefined) {
    getItemList();
    console.log('ID为空');
  } else {
    itemListByCategory(newCate);
    console.log('ID不为空: ' + newCate);
  }
  cate.value = newCate;
});

const itemListByCategory = async (cate) => {
  try {
    const result = await itemListByCategoryService(cate);
    itemList.value = result.data;
  } catch (error) {
    ElMessage.error('加载分类数据失败');
  }
};

const getItemList = async () => {
  try {
    const result = await itemListService();
    itemList.value = result.data;
  } catch (error) {
    ElMessage.error('加载数据失败');
  }
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

getItemList();
</script>


<style scoped>
.container {
  padding: 20px;
  box-sizing: border-box;
}

.latest-title {
  text-align: center;
  margin-top: -30px;
  font-size: 34px;
  font-weight: bold;
  color: #333;
}

a {
  text-decoration: none;
  color: inherit;
}

.item_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.item_element {
  width: calc(24% - 15px);
  height: 400px;
  margin-bottom: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.item_element:hover {
  transform: translateY(-10px);
}

.picHead {
  font-size: 20px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .item_element {
    width: calc(50% - 15px);
  }
}

@media (max-width: 480px) {
  .item_element {
    width: 100%;
  }
}

/* 分页器样式 */
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>

