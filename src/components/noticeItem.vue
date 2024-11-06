<template>
  <div
      class="notice-container"
      :class="{ 'system-notice': isSystemNotice }"
  >
    <el-avatar
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
            <span style="font-weight: bold">{{ notice.author.name }}</span>
            <span v-if="isSystemNotice" style="font-weight: bold;margin-left: 10px">系统通知</span>
            <span v-else style="margin-left: 10px">联系了您</span>
          </div>
        </el-tooltip>
      </div>
      <div class="notice-text-title">
        <el-tooltip
            :disabled="false"
            popper-class="notice-title-popper"
            v-if="!isSystemNotice && notice.contact"
            :content="notice.contact"
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
          :disabled="false"
          :content="notice.content"
      >
        <div
            ref="descriptionRef"
            class="notice-text-description"
        >
          {{ notice.content }}
        </div>
      </el-tooltip>
      <div class="notice-text-datetime">
        <span v-if="!isSystemNotice && notice.tradeTime">交易时间: {{ notice.tradeTime }}</span>
      </div>
      <div class="notice-text-datetime">
        <span>发送时间: {{ notice.updateTime }}</span>
      </div>
    </div>
    <div class="button-container">
      <el-button type="danger" v-if="(!isSystemNotice) && (notice.confirm === 0)" @click="dialogFormVisibleSwitch_2">
        时间再议
      </el-button>
      <el-button v-if="!isSystemNotice" @click="pushTo(notice.itemId)">
        发布详情
      </el-button>
      <el-button type="primary" @click="confirmNotice(notice)" v-if="notice.confirm != 1">
        确认
      </el-button>
    </div>
  </div>

  <el-dialog
      v-model="dialogFormVisible_2"
      title="时间再议"
      width="500"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
  >
    <el-form :model="noticeForm_2">
      <el-form-item label="选择你的空闲时间" :label-width="'140px'">
        <el-date-picker
            v-model="noticeForm_2.tradeTime"
            type="datetime"
            placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="请选择或输入联系方式">
        <el-input
            v-model="noticeForm_2.contact"
            placeholder="请输入联系方式"
            size="small"
        />
      </el-form-item>
      <el-form-item label="文字消息" :label-width="'140px'">
        <el-input type="textarea" :rows="5" v-model="noticeForm_2.content">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible_2 = false">取消</el-button>
        <el-button type="primary" @click="sendContact_2">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, computed } from "vue";
import { ElDatePicker, ElInput, ElMessage } from "element-plus";
import router from "@/router/router";
import { confirmNoticeService } from "@/api/user";
import { sendContactService } from "@/api/item";

const dialogFormVisible_2 = ref(false);

interface NoticeItem {
  id: number;
  content: string;
  itemId: number;
  tradeTime: string;
  updateTime: string;
  contact: string;
  confirm: number;
  system: number; // 新增字段
  author: {
    id: number;
    name: string;
    avatar: string;
    sex: number;
  };
  recipientId: number;
}

const emit = defineEmits(['child-event']);
const props = defineProps<{ notice: NoticeItem }>();

const isSystemNotice = computed(() => props.notice.system === 1);

const confirmNotice = async () => {
  if (!isSystemNotice.value){
    await confirmNoticeService({
      id: props.notice.id,
      itemId: props.notice.itemId,
      tradeTime: props.notice.tradeTime,
      updateTime: props.notice.updateTime,
      contact: props.notice.contact,
      confirm: props.notice.confirm,
      authorId: props.notice.author.id,
      recipientId: props.notice.recipientId,
    });
  }else {
    await confirmNoticeService({
      id: props.notice.id,
      confirm: 2,
    });
  }

  emit('child-event');
  ElMessage.success("已同意");
};

const pushTo = (id: number) => {
  router.push({ path: `/item/main/${id}` });
};


const noticeForm_2 = ref({
  tradeTime: new Date(),
  content: '这个时间我没空，你看看这个时间行不行',
  contact: '',
});

const sendContact_2 = async () => {
  if (isSystemNotice.value) return; // 如果是系统通知，直接返回
  dialogFormVisible_2.value = false;
  await sendContactService({
    content: noticeForm_2.value.content,
    itemId: props.notice.itemId,
    tradeTime: noticeForm_2.value.tradeTime,
    recipientId: props.notice.author.id,
    contact: noticeForm_2.value.contact,
  });
  await confirmNoticeService({
    id: props.notice.id,
    confirm: 2,
  });
  emit('child-event');
  ElMessage.success("发送成功");
};

const dialogFormVisibleSwitch_2 = () => {
  dialogFormVisible_2.value = !dialogFormVisible_2.value;
};
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

  .button-container {
    float: right;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .el-button + .el-button {
      margin-top: 10px;
    }
  }
}
</style>
