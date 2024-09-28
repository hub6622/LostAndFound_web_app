<template>
  <div class="common-layout">
    <el-container>
      <header-vue/>
      <el-container class="align-container">
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
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
if(route.path === '/userInfo'){
  showOrNot.value = false
}else {
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
.el-main{
  overflow: visible;
}
.common-layout {
  overflow: visible;
  width: 100%;
  min-width: 1000px;
  color: #5e606f;
  left: 0;
  top: 0;
}
.align-container{
  width: calc(100% - 350px);
  display: flex;
  margin-left: 50px;
}

.el-container {
  background-color: whitesmoke;
}
.el-footer {
  background-color: #545c64;
}
</style>