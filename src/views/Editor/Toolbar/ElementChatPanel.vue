<template>
  <div class="element-chat-panel">
    <!-- 顶部提示区域 -->
    <div class="tip" @click="selectSlideTemplate(0)">
      <IconClick style="margin-right: 5px;"/> 点我选择模板
    </div>
    <Divider />
    <!-- 聊天消息显示区 -->
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="{'message-sent': msg.sent, 'message-received': !msg.sent}">
        {{ msg.content }}
      </div>
    </div>
    <!-- 消息输入区域 -->
    <div class="chat-input-container">
      <textarea v-model="message" placeholder="输入消息..." class="chat-input"></textarea>
      <button @click="sendMessage" class="send-button">send</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Divider from '@/components/Divider.vue';

const messages = ref([{ content: "欢迎来到聊天室！", sent: false }]);
const message = ref('');

const sendMessage = () => {
  if (message.value.trim() !== '') {
    messages.value.push({ content: message.value, sent: true });
    message.value = ''; // 清空输入框

    // 模拟AI回复
    setTimeout(() => {
      messages.value.push({ content: "test success", sent: false });
    }, 500); // 假设AI回复延迟为500ms
  }
};
</script>

<style lang="scss" scoped>
.element-chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tip, .chat-messages, .chat-input-container {
  padding: 10px;
}

.tip {
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: italic;
  cursor: pointer;
  margin-bottom: 10px; // 为提示区域和消息显示区域之间提供间隔
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
  word-break: break-word; // 确保长消息不会溢出屏幕
}

.message-sent {
  align-self: flex-end;
  text-align: right;
  background-color: transparent; /* 移除背景颜色 */
}

.message-received {
  align-self: flex-start;
  text-align: left;
  background-color: transparent; /* 移除背景颜色 */
}

.chat-input-container {
  display: flex;
  gap: 10px; // 为输入框和发送按钮提供间隔
}

.chat-input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
  resize: none; // 阻止用户调整输入框大小
}

.send-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
}

/* 新增样式，确保输入区始终在底部 */
.chat-input-container {
  margin-top: auto;
}
</style>
