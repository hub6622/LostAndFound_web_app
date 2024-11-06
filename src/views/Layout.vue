<template>
  <div class="common-layout">
    <el-container class="el_container_b">
      <el-header style="padding: 0 0;">
        <header-vue/>
      </el-header>
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
  width: 74%;
  margin-left: 10%;
  margin-top: 1%;
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
}

.el_container_b {
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
.float-right {
  width: 20%;
  height: auto;
}
</style>
