<template>
  <div class="container">
    <!--  <div class="body">-->
    <h1 class="title">{{ item.title }}</h1>
    <div class="connect_btn">
      <el-button type="primary" @click="dialogFormVisibleSwitch" style="width: 200px" v-if="isLostOrFound">联系作者
      </el-button>
      <el-button type="primary" @click="dialogFormVisibleSwitch" style="width: 200px" v-else>联系失主</el-button>

      <el-dialog v-model="dialogFormVisible" title="联系对方信息" width="500">
        <el-form :model="noticeForm">
          <el-form-item label="选择你的空闲时间" :label-width="'140px'">
            <div class="block">
              <el-date-picker
                  v-model="noticeForm.tradeTime"
                  type="datetime"
                  placeholder="Select date and time"
              />
            </div>
          </el-form-item>
          <el-form-item label="请选择或输入联系方式">
            <el-select v-model="noticeForm.contact">
              <el-option label="手机号" :value="userInfo.phone">
                手机号: {{userInfo.phone}}
              </el-option>
              <el-option label="邮箱" :value="userInfo.email">
                邮箱: {{userInfo.email}}
              </el-option>
              <el-option label="自定义" value="" disabled>
                <template #default>
                  <el-input
                      v-model="noticeForm.contact"
                      placeholder="请输入自定义联系方式"
                      size="small"
                  />
                </template>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文字消息" :label-width="'140px'">
            <el-input type="textarea" :rows="5" v-model="noticeForm.content">
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="sendContact">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <!--  个人信息  -->
    <div class="author">
      <el-row>
        <el-col :span="3">
          <div class="demo-basic--circle">
            <div>
              <el-avatar shape="square" :size="50" :src="item.author.avatar"/>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="userInfo">
            <span>用户:{{ item.author.name }}</span>
            <div>
              <span>{{ item.createTime }}</span>
              <span>查看:   {{ item.viewCounts }}</span>
              <span>评论:   {{ item.commentCounts }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="width: 1000px;margin-bottom: 450px">
      <div style="float: left;padding-bottom: 20px;">
        <el-image :src="item.picUrl" style="width: 400px;height: 400px" :preview-src-list="[item.picUrl]"/>
      </div>
      <div class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.content }}</div>
    </div>
    <h2>评论区</h2>
    <div class="comment-input">
      <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入评论"
          v-model="commentContent">
      </el-input>
      <el-button style="float: right" type="primary" @click="addComment">评论</el-button>
    </div>

    <div v-if="!item.comment">快来抢沙发吧！！！</div>
    <div class="comment" v-else v-for="(com, index) in item.comment" :key="index">
      <commentUserVue :comments="com" :commentIndex="index" @updateReply="updateReply"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import commentUserVue from "@/components/commentUser.vue";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {useRoute} from "vue-router";
import router from "@/router/router"
import {
  itemListByIdService,
  addCommentService,
  updateItemViewCountService,
  commentsByItemIdService,
  sendContactService
} from "@/api/item";
import {ElMessage, ElDatePicker} from "element-plus";

const route = useRoute();
const userInfoStore = useUserInfoStore();
const userInfo = ref(userInfoStore.info)

interface Item {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
    avatar: string;
  };
  createTime: string;
  viewCounts: number;
  commentCounts: number;
  content: string;
  picUrl: string;
  lostOrFound: number;
  comment: {
    id: number;
    commentAuthor: {
      name: string;
      avatar: string;
    },
    commentTime: string;
    content: string;
    commentOrder: number;
    commentReply: {
      id: number;
      replyAuthor: {
        name: string;
        avatar: string;
      },
      replyTime: string,
      content: string,
    }[]
  }[];
}

const item = ref<Item>({
  id: 0,
  title: "",
  author: {
    id: 0,
    name: "",
    avatar: "",
  },
  createTime: "",
  viewCounts: 0,
  commentCounts: 0,
  content: "",
  picUrl: "#",
  lostOrFound: 0,
  comment: [
    {
      id: 0,
      commentAuthor: {
        name: "",
        avatar: "",
      },
      commentTime: "",
      content: "",
      commentOrder: 0,
      commentReply: [
        {
          id: 0,
          replyAuthor: {
            name: "",
            avatar: "",
          },
          replyTime: "",
          content: "",
        }
      ]
    }
  ]
});
const dialogFormVisible = ref(false)

const dialogFormVisibleSwitch = ()=>{
  if(userInfo.value && userInfo.value.phone != null ){
    dialogFormVisible.value = !dialogFormVisible.value
  }else {
    ElMessage.error("未登录，请先登录")
    router.push('/login')
  }
}
const noticeForm = ref({
  tradeTime: new Date(),
  contact: '',
  content: '',
})
const isLostOrFound = ref(false)

const getItem = async (itemId) => {
  let result = await itemListByIdService(itemId);
  item.value = result.data;
  isLostOrFound.value = result.data.lostOrFound === 1;
  updateViewCounts();
};
getItem(route.params.itemId);

const getComments = async (itemId) => {
  let result = await commentsByItemIdService(itemId);
  item.value.comment = result.data;
  console.log(item.value.comment[0].commentReply);
};
getComments(route.params.itemId);

const commentContent = ref("");
const addComment = async () => {
  // 直接评论使用itemId值，commentContent，新增commentId并绑定到表中
  await addCommentService({content: commentContent.value, itemId: item.value.id});
  await getComments(item.value.id);
  commentContent.value = "";
  ElMessage.success("评论成功");
};

const updateViewCounts = () => {
  item.value.viewCounts++;
  updateItemViewCountService(item.value.id);
};

const updateReply = async () => {
  await getComments(item.value.id);
};
const sendContact = async () => {
  dialogFormVisible.value = false
  await sendContactService({
    content: noticeForm.value.content,
    itemId: item.value.id,
    contact: noticeForm.value.contact,
    tradeTime: noticeForm.value.tradeTime,
    recipientId: item.value.author.id
  });
  ElMessage.success("发送成功")
}
watch(() => route.params.itemId, async (newValue, oldValue) => {
  await getItem(newValue);
  await getComments(newValue);
});
</script>

<style scoped>
.container {
  width: 1000px;
  margin: -50px auto;
}

.author {
  margin-bottom: 10px;
}

.comment-input {
  width: 400px;
  margin-bottom: 40px;
}

.connect_btn {
  float: right;
  margin-right: 100px;
}

.content {
  float: left;
  width: 500px;
  font-size: 20px;
  margin-left: 20px;
  line-height: 30px;
}
.comment{
  margin-bottom: 50px;
}
.title {
  font-size: 50px;
}

.userInfo {
  margin-left: -30px;
}

.userInfo span {
  margin-right: 10px;
}
</style>
