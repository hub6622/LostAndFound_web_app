<template>
  <div>
    <div class="item_container">
      <div>
        <span class="latest-title" style="margin-right: 400px">失物信息</span>
      </div>
      <div v-for="lostItem in displayedLostItems" :key="lostItem.id" class="item_element">
        <a href="#" @click.prevent="pushTo(lostItem)">
          <div class="card-content">
            <span class="card-title">{{ lostItem.title }}</span>
            <el-image :src="lostItem.picUrl" class="card-image" slot="err"/>
          </div>
          <div class="card-content-text">
            &nbsp;&nbsp;&nbsp;&nbsp;{{ lostItem.content }}
          </div>
        </a>
      </div>
    </div>
  </div>
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
</template>


<script setup>

</script>

<style scoped>
.item_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 800px;
  width: 640px;
  float: left;
  gap: 20px;
  margin-top: 25px;
  border-radius: 8px;
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>