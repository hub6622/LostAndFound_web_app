<template>
  <div class="container">
    <h2 class="latest-title"><a href="#"  @click="router.push('/item/category/最新')">最新发布</a></h2>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in displayedCarouselItems" :key="item.id">
        <a href="#" @click.prevent="pushTo(item)">
          <span class="picHead">{{ item.title }}</span>
          <img :src="item.picUrl" style="width: 100%;"/>
        </a>
      </el-carousel-item>
    </el-carousel>

    <div class="item_show">
      <div class="item_container lost_items">
        <div>
          <span class="latest-title" style="margin-right: 400px">失物信息</span>
          <a href="#" style="color: dodgerblue" @click="router.push('/item/category/失物')">查看更多</a>
        </div>
        <div v-for="lostItem in displayedLostItems" :key="lostItem.id" class="item_element">
          <a href="#" @click.prevent="pushTo(lostItem)">
            <div class="card-content">
              <span class="card-title">{{ lostItem.title }}</span>
              <div style="display: flex;flex-wrap: wrap;gap: 5px;margin-top: -5px;margin-bottom: 5px">
                <el-tag v-for="cate in lostItem.categories" :key="cate" type="success">{{cate}}</el-tag>
              </div>
              <el-image :src="lostItem.picUrl" class="card-image" slot="err"/>
            </div>
            <div class="card-content-text">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ truncateContent(lostItem.content, 34) }}
            </div>
          </a>
        </div>
      </div>

      <div class="item_container found_items">
        <div>
          <span class="latest-title" style="margin-right: 400px">拾得信息</span>
          <a href="#" style="color: dodgerblue" @click="router.push('/item/category/招领')">查看更多</a>
        </div>
        <div v-for="foundItem in displayedFoundItems" :key="foundItem.id" class="item_element">
          <a href="#" @click.prevent="pushTo(foundItem)">
            <div class="card-content">
              <span class="card-title">{{ foundItem.title }}</span>
              <div style="display: flex;flex-wrap: wrap;gap: 5px;margin-top: -5px;margin-bottom: 5px">
                <el-tag v-for="cate in foundItem.categories" :key="cate" type="success">{{cate}}</el-tag>
              </div>
              <el-image :src="foundItem.picUrl" class="card-image" slot="err"/>
            </div>
            <div class="card-content-text">
              &nbsp;&nbsp;&nbsp;&nbsp;{{ truncateContent(foundItem.content, 34) }}
            </div>
          </a>
        </div>
      </div>
    </div>
    <div>
      <div style="float: left;margin-left: 245px">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="lostItemCount"
            @current-change="handleLostCurrentChange"
            :page-size="4"
            :current-page="lostCurrentPage"
            :hide-on-single-page="hideIsForT"
        />
      </div>
      <div style="float: right;margin-right: 265px">
        <el-pagination
            background
            layout="prev, pager, next"
            :total="foundItemCount"
            @current-change="handleFoundCurrentChange"
            :page-size="4"
            :current-page="foundCurrentPage"
            :hide-on-single-page="hideIsForT"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue';
import router from '@/router/router.js';
import {useRoute} from 'vue-router';
import {itemListService, itemListByCategoryService} from '@/api/item.js';
import {ElMessage} from 'element-plus';
import pic404 from '@/assets/404pic.jpg';

const hideIsForT = ref(false);
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
    lostOrFound: 2,
    author: {
      name: '作者'
    }
  }
]);

const foundCurrentPage = ref(1);
const lostCurrentPage = ref(1);

const displayedCarouselItems = computed(() => {
  const start = 0;
  const end = 6;
  return itemList.value.slice(start, end);
});
// 计算显示的丢失物品项
const displayedLostItems = computed(() => {
  const start = (lostCurrentPage.value - 1) * 4;
  const end = start + 4;
  return itemList.value.filter(item => item.lostOrFound === 1).slice(start, end);
});

// 计算显示的找到物品项
const displayedFoundItems = computed(() => {
  const start = (foundCurrentPage.value - 1) * 4;
  const end = start + 4;
  return itemList.value.filter(item => item.lostOrFound === 0).slice(start, end);
});

// 计算丢失物品的数量
const lostItemCount = computed(() => itemList.value.filter(item => item.lostOrFound === 1).length);

// 计算找到物品的数量
const foundItemCount = computed(() => itemList.value.filter(item => item.lostOrFound === 0).length);


const pushTo = (item) => {
  router.push({path: `/item/main/${item.id}`});
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
const truncateContent = (content, maxLength) => {
  if (content.length > maxLength) {
    return content.slice(0, maxLength) + '...';
  }
  return content;
};
const handleLostCurrentChange = (newPage) => {
  lostCurrentPage.value = newPage;
};
const handleFoundCurrentChange = (newPage) => {
  foundCurrentPage.value = newPage;
};
getItemList();
</script>

<style scoped>
.item_element {
  width: 46%;
  height: 44%;
  background-color: whitesmoke;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
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

.item_show{
  height: 1000px;
  float: none;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-image {
  width: 100%;
  height: 280px; /* 固定高度 */
  object-fit: cover;
  border-radius: 10px;
}

.card-content-text {
  height: 65px;
  width: 85%;
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
  width: 49%;
  height: 100%;
  float: left;
  gap: 20px;
  margin-top: 25px;
  border-radius: 8px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.lost_items {
  margin-right: 5px;
  background-color: navajowhite;
}
.found_items{
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
    width: 460px; /* 宽度调整为适合平板设备 */
    height: 400px;
  }
}

@media (max-width: 480px) {
  .item_element {
    width: 100%; /* 宽度调整为适合手机设备 */
    height: 400px;
  }
}

/* 分页器样式 */
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
