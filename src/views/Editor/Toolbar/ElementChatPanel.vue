<template>
  <div class="element-chat-panel">
    <div class="tip" @click="selectSlideTemplate(0)">
      <IconClick /> 点我选择模板
    </div>
    <Divider />
    <div class="chat-messages">
      <div v-for="(msg, index) in messages" :key="index" class="message" :class="{'message-sent': msg.type === MessageType.User, 'message-received': msg.type === MessageType.AI}">
        <div v-if="msg.type === MessageType.AI" class="ai-message-container">
          <img src="@/assets/robot-one.svg" alt="AI" class="avatar">
          <div class="ai-message-content" style="margin-top: 1rem;">
            <span v-html="formatMessage(msg)"></span>
          </div>
        </div>
        <div v-else>
          <span v-html="formatMessage(msg)"></span>
        </div>
      </div>
  </div>
    <div class="chat-input-container">
      <textarea v-model="input_message" 
                placeholder="输入消息..." 
                class="chat-input" 
                @keyup.enter="sendOnEnter" 
                @keydown.enter.prevent="() => {}"></textarea>
      <button @click="sendMessage" class="send-button">
        <img src="@/assets/send-one.svg" alt="Send" />
      </button>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import Divider from '@/components/Divider.vue';

const MessageType = {
  User: 'MessageUser',
  AI: 'MessageAI'
};

// 从localStorage读取聊天历史，如果没有则初始化为空数组
const storedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
const messages = ref(storedMessages);
const input_message = ref('');


const sendMessage = () => {
  if (input_message.value.trim() !== '') {
    const userMessage = {
      content: input_message.value,
      type: MessageType.User
    };
    messages.value.push(userMessage);
    input_message.value = '';

    // 保存消息
    saveMessagesToLocalStorage();

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        content: "AI response",
        type: MessageType.AI
      };
      messages.value.push(aiResponse);
      
      // 保存消息
      saveMessagesToLocalStorage();
    }, 500); 
  }
};

// 用于保存消息到localStorage
const saveMessagesToLocalStorage = () => {
  localStorage.setItem('chatMessages', JSON.stringify(messages.value));
};


const sendOnEnter = (event) => {
  if (!event.shiftKey) { 
    sendMessage();
  }
};

const formatMessage = (msg) => msg.content;

onMounted(() => {
  // 在组件加载时，从localStorage读取聊天历史
  messages.value = JSON.parse(localStorage.getItem('chatMessages') || '[]');
});

watch(messages, () => {
  // 每次messages变化时，保存到localStorage
  saveMessagesToLocalStorage();
});
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
  flex-grow: 1; /* 让聊天消息区域占用所有可用空间 */
  overflow-y: auto; /* 添加滚动条 */
}

.message {
  word-break: break-word;
  margin-top: 1rem;
}

.message-sent {
  border-radius: 5px;
  padding: 10px;
  align-self: flex-start;
}

.message-received {
  background-color: #f9f9f9;
  align-self: flex-start;
  border-radius: 5px;
  padding: 10px;
}

.chat-input-container {
  display: flex;
  gap: 10px;
  margin-top: auto
}
  

.chat-input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px 12px;
}

.send-button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c1c1c1;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  .ai-prefix {
  font-weight: bold;
  color: #007bff; /* 或者选择一个更适合您的UI设计的颜色 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
}
</style>
