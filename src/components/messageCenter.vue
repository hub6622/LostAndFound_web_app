<template>
  <div style="display: flex; align-items: center">
    <el-popover
        :width="300"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
    >
      <template #reference>
        <el-avatar :size="50" shape="square" :src="userInfo.avatar"/>
      </template>
      <template #default>
        <div class="demo-rich-content" style="display: flex; gap: 16px; flex-direction: column">
          <el-avatar :size="100" :src="userInfo?.avatar" style="margin-bottom: 8px" shape="square"/>
          <div>
            <p class="demo-rich-content__name" style="margin: 0; font-weight: 500; font-size: 20px">
              {{ userInfo?.name }}
            </p>
            <p class="demo-rich-content__mention" style="margin: 0; font-size: 14px; color: var(--el-color-info)">
              {{ userInfo?.email }}
            </p>
          </div>
          <p class="demo-rich-content__desc" style="margin: 0">
            {{ userInfo?.biography }}
          </p>
          <el-button @click="pushTo('/userInfo')">
            <el-icon>
              <edit/>
            </el-icon>
            编辑个人资料
          </el-button>
        </div>
      </template>
    </el-popover>


    <el-popover placement="bottom" :width="400" trigger="click">
      <template #reference>
        <el-badge :value="badgeCount" :max="9" :hidden="badgeCount === 0" :offset="[0, 15]">
          <el-button style="margin-left: 26px; margin-bottom: 10px;">查看通知</el-button>
        </el-badge>
      </template>
      <el-button @click="showHistoryDialog">历史通知</el-button>
      <notice-item-vue v-for="notice in noticeItem" :key="notice.id" :notice="notice" @child-event="getNotice" />
    </el-popover>


  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, defineProps} from 'vue'
import router from '@/router/router'
import noticeItemVue from '@/components/noticeItem.vue'
import {getUserNoticeService, getNoticeHistoryService} from '@/api/user'
import {ElMessage} from "element-plus";

interface UserInfo {
  name: string
  nickname: string
  avatar: string
  biography: string
  phone: string
  email: string
  sex: string
}

interface NoticeItem {
  id: number
  content: string
  itemId: number
  tradeTime: string
  updateTime: string
  contact: string
  confirm: number
  author: {
    id: number
    name: string
    avatar: string
    sex: number
  }
  recipientId:number
}
const userInfo = ref<UserInfo>({
  name: '',
  nickname: '',
  avatar: '',
  biography: '',
  phone: '',
  email: '',
  sex: ''
})
const props = defineProps<{ userInfo: UserInfo }>();
onMounted(() => {
  userInfo.value = props.userInfo
  if(userInfo){
    getNotice()
  }else {
    alert(222)
  }
})
const badgeCount = ref(0)
const noticeItem = ref<NoticeItem[]>([])

const getNotice = async () => {
  const result = await getUserNoticeService()
  badgeCount.value = result.data.length
  noticeItem.value = result.data
}
const pushTo = (path: string) => {
  if (userInfo) {
    router.push({path: path})
  } else {
    ElMessage.error("未登录，请先登录")
    router.push("/login")
  }
}
const showHistoryDialog = async () => {
  let result = await getNoticeHistoryService()
  noticeItem.value = result.data
}


</script>

<style scoped lang="scss">
.demo-rich-content {
  &__name {
    margin: 0;
    font-weight: 500;
    font-size: 20px;
  }

  &__mention {
    margin: 0;
    font-size: 14px;
    color: var(--el-color-info);
  }

  &__desc {
    margin: 0;
  }
}
</style>
