<template>
  <div
      class="notice-container"
  >
    <el-avatar
        v-if="true"
        :size="50"
        :src="notice.author.avatar"
        class="notice-container-avatar"
    />
    <div class="notice-container-text">
      <div class="notice-text-title">
        <el-tooltip
            popper-class="notice-title-popper"
            :disabled="true"
        >
          <div
              ref="titleRef"
              class="notice-title-content"
          >
            <span style="font-weight: bold">{{ notice.author.name }}</span><span
              style="margin-left: 10px">联系了您</span>
          </div>
        </el-tooltip>
      </div>
      <div class="notice-text-title">
        <el-tooltip
            :disabled="true"
            popper-class="notice-title-popper"
        >
          <div
              ref="titleRef"
              class="notice-title-content"
          >
            联系方式: {{ notice.contact }}
          </div>
        </el-tooltip>

      </div>
      <el-tooltip
          popper-class="notice-title-popper"
          :disabled="true"
      >
        <div
            ref="descriptionRef"
            class="notice-text-description"
        >
          {{ notice.content }}
        </div>
      </el-tooltip>
      <div class="notice-text-datetime">
        <span>交易时间: {{ notice.tradeTime }}</span>
      </div>
      <div class="notice-text-datetime">
        <span>回复时间: {{ notice.updateTime }}</span>
      </div>
    </div>
  </div>
  <div style="float: right;margin-top: 50px">
    <div>
      <el-button type="primary" @click="confirmNotice(notice.id)" v-if="notice.confirm===0">
        同意
      </el-button>
    </div>
    <div style="margin-top: 10px">
      <el-button @click="pushTo(notice.itemId)">
        发布详情
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {ElDatePicker, ElMessage} from "element-plus";
import router from "@/router/router"
import {confirmNoticeService} from "@/api/user"
interface NoticeItem {
  id: number,
  content: string,
  itemId: number,
  tradeTime: string,
  updateTime: string,
  contact: string,
  confirm: number,
  author: {
    id: number,
    name: string,
    avatar: string,
    sex: number
  }
}

defineProps<{ notice: NoticeItem }>()
const confirmNotice = async (id) => {
  await confirmNoticeService(id)
  ElMessage.success("已同意")
}
const pushTo = (id) => {
  router.push({path: `/item/main/${id}`})
}

</script>

<style scoped lang="scss">
.notice-container {
  float: left;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid burlywood;

  .notice-container-avatar {
    margin-right: 10px;
    margin-top: -10px;
    background: red;
  }

  .notice-container-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .notice-text-title {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5715;
      cursor: pointer;

      .notice-title-content {
        flex: 1;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice-title-extra {
        float: right;
        margin-top: -1.5px;
        font-weight: 400;
      }
    }

    .notice-text-description,
    .notice-text-datetime {
      font-size: 12px;
      line-height: 1.5715;
      width: 200px;
    }

    .notice-text-description {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .notice-text-datetime {
      margin-top: 4px;
    }
  }
}
</style>
