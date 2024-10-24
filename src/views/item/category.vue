<template>
  <div>
    <span v-if="isCategory">
      分类
    </span>
    <div class="item_container">
      <div v-for="item in paginatedItems" :key="item.id" class="item_element">
        <a href="#" @click.prevent="pushTo(item)">
          <div class="card-content">
            <span class="card-title">{{ item.title }}</span>
            <div style="display: flex;flex-wrap: wrap;gap: 5px;margin-top: -5px;margin-bottom: 5px">
              <el-tag v-for="cate in item.categories" :key="cate" type="success">{{ cate }}</el-tag>
            </div>
            <el-image :src="item.picUrl" class="card-image" slot="err" />
          </div>
          <div class="card-content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ truncateContent(item.content, 20) }}
          </div>
        </a>
      </div>
    </div>
    <div class="pagination_container">
      <el-pagination
          background
          layout="prev, pager, next"
          :total="itemCount"
          @current-change="handleCurrentChange"
          :page-size="8"
          :current-page="currentPage"
          :hide-on-single-page="hideIsForT"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import router from '@/router/router.js';
import { useRoute } from 'vue-router';
import {itemListService, itemListByCategoryService, getNewestListService, searchItemService} from '@/api/item.js';
import { ElMessage } from 'element-plus';

const hideIsForT = ref(false);
const itemList = ref([]);
const currentPage = ref(1);
const itemCount = computed(() => itemList.value.length);
const isCategory = ref(true);

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * 8;
  const end = start + 8;
  return itemList.value.slice(start, end);
});

const pushTo = (item) => {
  router.push({ path: `/item/main/${item.id}` });
};

const route = useRoute();
const cate = ref(route.params.cate);

const getItemList = async () => {
  try {
    const result = await itemListService();
    itemList.value = result.data;
  } catch (error) {
    ElMessage.error('加载数据失败');
    console.error('加载数据失败:', error);
  }
};

const getLost = async () => {
  await getItemList();
  const lostItems = itemList.value.filter(item => item.lostOrFound === 1);
  itemList.value = lostItems;
};

const getFound = async () => {
  await getItemList();
  const foundItems = itemList.value.filter(item => item.lostOrFound === 0);
  itemList.value = foundItems;
};

const itemListByCategory = async (cate) => {
  try {
    const result = await itemListByCategoryService(cate);
    itemList.value = result.data;
  } catch (error) {
    ElMessage.error('加载分类数据失败');
    console.error('加载分类数据失败:', error);
  }
};

const searchItem = async (query) => {
  try {
    const params = {
      category: query.value,
      title: query.value
    }
    const result = await searchItemService(params);
    itemList.value = result.data;
  } catch (error) {
    ElMessage.error('搜索数据失败');
    console.error('搜索数据失败:', error);
  }
};
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

const loadItemsByCategory = async (category) => {
  if (category === '失物') {
    isCategory.value = false;
    await getLost();
  } else if (category === '招领') {
    isCategory.value = false;
    await getFound();
  } else if (category === '最新') {
    isCategory.value = false;
    await getItemList();
  } else {
    isCategory.value = true;
    await itemListByCategory(category);
  }
};

watch(() => route.params.cate, (newCate) => {
  cate.value = newCate;

  if (route.path.startsWith('/item/search/')) {
    searchItem(cate);
  } else {
    loadItemsByCategory(newCate);
  }
}, { immediate: true });

onMounted(() => {
  loadItemsByCategory(cate.value);
});

const truncateContent = (content, maxLength) => {
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + '...';
  }
  return content;
};
</script>

<style scoped>
/* 保留原有样式 */
.item_element {
  width: 300px;
  height: 350px;
  background-color: whitesmoke;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  margin: 0px; /* 添加间距 */
}

.item_element:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-image {
  width: 100%;
  height: 200px; /* 固定高度 */
  object-fit: cover;
  border-radius: 10px;
}

.card-content-text {
  height: 75px;
  width: 260px;
  font-size: 14px;
  color: #666;
  padding-left: 15px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
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
  margin-top: 25px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.lost_items {
  margin-right: 5px;
  background-color: navajowhite;
}

.found_items {
  background-color: antiquewhite;
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
    width: 48%; /* 平板设备上每行两个物品 */
    height: 400px;
  }
}

@media (max-width: 480px) {
  .item_element {
    width: 100%; /* 手机设备上每行一个物品 */
    height: 400px;
  }
}

/* 分页器样式 */
.pagination_container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
