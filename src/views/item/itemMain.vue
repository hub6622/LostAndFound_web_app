<template>
  <!--  <div class="body">-->
  <h1 class="title">{{ item.title }}</h1>
  <!--  个人信息  -->
  <div class="author">
    <el-row>
      <el-col :span="2">
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
            <span>阅读   {{ item.viewCounts }}</span>
            <span>评论   {{ item.commentCounts }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="content" v-html="item.content"></div>
  <div class="comment-input">
    <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="commentContent">
    </el-input>
    <el-button style="float: right" type="primary" @click="addComment">评论</el-button>
  </div>
  <div v-if="!item.comment">快来抢沙发吧！！！</div>
  <div v-else v-for="(com, index) in item.comment" :key="index">
    <commentUserVue :comments="com" :commentIndex="index" @updateReply="updateReply"/>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import commentUserVue from "@/components/commentUser.vue";
import { useUserInfoStore } from "@/stores/userInfo.js";
import { useRoute } from "vue-router";
import { itemListByIdService, addCommentService, updateItemService, commentsByItemIdService } from "@/api/item";
import { ElMessage } from "element-plus";

const route = useRoute();
const userInfoStore = useUserInfoStore();

interface Item {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  createTime: string;
  viewCounts: number;
  commentCounts: number;
  content: string;
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
    name: "",
    avatar: "",
  },
  createTime: "",
  viewCounts: 0,
  commentCounts: 0,
  content: "",
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

const getArticle = async (itemId) => {
  let result = await itemListByIdService(itemId);
  item.value = result.data;
  updateViewCounts();
};
getArticle(route.params.itemId);

const getComments = async (itemId) => {
  let result = await commentsByItemIdService(itemId);
  item.value.comment = result.data;
  console.log(item.value.comment[0].commentReply);
};
getComments(route.params.itemId);

const commentContent = ref("请输入内容");
const addComment = async () => {
  // 直接评论使用itemId值，commentContent，新增commentId并绑定到表中
  await addCommentService({ content: commentContent.value, itemId: item.value.id });
  await getComments(item.value.id);
  ElMessage.success("评论成功");
};

const updateViewCounts = () => {
  item.value.viewCounts++;
  updateItemService(item.value.id);
};

const updateReply = async () => {
  await getComments(item.value.id);
};

watch(() => route.params.itemId, async (newValue, oldValue) => {
  await getArticle(newValue);
  await getComments(newValue);
});
</script>

<style scoped>
.content {
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 30px;
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
