<template>
  <div class="common-layout">
    <el-container class="el_container_b" >
      <header-vue/>
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      <el-footer>
        <footer-vue/>
      </el-footer>
    </el-container>
    <asideCom class="float-right" v-if="showOrNot"></asideCom>
  </div>
</template>

<script setup lang="ts">
import asideCom from '@/components/floatingAsideMenu.vue'
import headerVue from '@/components/header.vue'
import footerVue from '@/components/footer.vue'
import {ref, watch} from "vue";
import {useRoute} from "vue-router"

const route = useRoute()
const showOrNot = ref(true)
if (route.path === '/userInfo') {
  showOrNot.value = false
} else {
  showOrNot.value = true
}
watch(() => route.path, (newValue, oldValue) => {
  if (newValue === '/userInfo') {
    showOrNot.value = false
  } else {
    showOrNot.value = true
  }
})
</script>

<style lang="scss" scoped>
.el-main {
  box-sizing: border-box;
  overflow: visible;
  width: calc(100% - 700px);
  margin-left: 300px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
}
 .el_container_b{
   min-height: 140vh;
 }
.common-layout {
  overflow: visible;
  width: 100%;
  min-width: 1000px;
  color: #5e606f;
  left: 0;
  top: 0;
}

.el-container {
  background-color: whitesmoke;
}

.el-footer {
  background-color: #545c64;
  height: 60px; /* 固定高度 */
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .align-container {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .align-container {
    flex-direction: column;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .align-container {
    flex-direction: column;
    margin-left: 0;
  }
}
</style>
