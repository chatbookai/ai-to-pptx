<template>
  <div class="element-chat-panel">
    <!-- 顶部提示区域 -->
    <div class="tip" @click="selectSlideTemplate(0)">
      <IconClick /> 点我选择模板
    </div>
    <Divider />
    <!-- 聊天消息显示区 -->
    <div class="chat-messages">
      <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="{'message-sent': msg.sent, 'message-received': !msg.sent}">
        <span v-html="formatMessage(msg)"></span>
      </div>
    </div>
    </div>
    <!-- 消息输入区域 -->
    <div class="chat-input-container">
      <textarea v-model="message" 
                placeholder="输入消息..." 
                class="chat-input" 
                @keyup.enter="sendOnEnter" 
                @keydown.enter.prevent="() => {}" 
                ></textarea>
      <button @click="sendMessage" class="send-button">send</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Divider from '@/components/Divider.vue';

const messages = ref([{ content: "chat with ai！", sent: false }]);
const message = ref('');

const sendMessage = () => {
  if (message.value.trim() !== '') {
    messages.value.push({ content: message.value, sent: true });
    message.value = ''; 

    // 模拟AI回复
    setTimeout(() => {
      messages.value.push({ content: "test success", sent: false });
    }, 500); 
  }
};

const sendOnEnter = (event) => {
  if (!event.shiftKey) { 
    sendMessage();
  }
};

const formatMessage = (msg) => {
  if (!msg.sent) {
    
    return `AI:<br><br>${msg.content}`;
  } else {
    return msg.content;
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
  margin-bottom: 10px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
}

.message {
  margin-bottom: 10px;
  padding: 4px 4px;
  border-radius: 8px;
  background-color: transparent; /* 去掉背景色 */
  word-break: break-word; /* 确保长消息能够换行 */
  display: flex; /* 启用flex布局 */
  justify-content: flex-start; /* 对于发送的消息，内容向右对齐 */
}

.message-received {
  justify-content: flex-start; /* 对于接收的消息，内容向左对齐 */
}

.message-sent,
.message-received {
  text-align: start; /* 确保文本从容器的开始对齐 */
}
.chat-input-container {
  display: flex;
  gap: 10px;
  margin-top: auto; /* 确保输入区始终在底部 */
}

.chat-input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
  resize: none;
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
  .ai-prefix {
  font-weight: bold;
  color: #007bff; /* 或者选择一个更适合您的UI设计的颜色 */
}
}
</style>
