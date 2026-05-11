<template>
  <view class="chat-container">
    <view class="custom-nav">
      <text class="nav-title">AI聊天</text>
    </view>
    <scroll-view 
      class="chat-list" 
      scroll-y 
      :scroll-into-view="scrollToId"
      scroll-with-animation
    >
      <view 
        v-for="message in messages" 
        :key="message.id" 
        :id="'msg-' + message.id"
        class="message-item"
        :class="{ 'is-user': message.isUser }"
      >
        <view class="message-avatar">
          <text class="avatar-icon">{{ message.isUser ? '👤' : '🤖' }}</text>
        </view>
        <view class="message-content">
          <text class="message-text">{{ message.content }}</text>
          <text class="message-time">{{ formatTime(message.createdAt) }}</text>
        </view>
      </view>
      
      <view class="typing-indicator" v-if="isTyping">
        <view class="typing-dots">
          <view class="dot"></view>
          <view class="dot"></view>
          <view class="dot"></view>
        </view>
        <text class="typing-text">正在思考...</text>
      </view>
    </scroll-view>
    
    <view class="input-area">
      <view class="input-wrapper">
        <input 
          class="chat-input"
          v-model="inputText"
          placeholder="和我说说吧..."
          @confirm="sendMessage"
        />
        <view class="send-btn" :class="{ active: inputText.trim() }" @click="sendMessage">
          <text class="send-icon">➤</text>
        </view>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getChats, saveChatMessage, generateId, type ChatMessage } from '@/utils/storage'
import { mockChatMessages, getAIResponse } from '@/data/mock'

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const isTyping = ref(false)
const scrollToId = ref('')

onMounted(() => {
  loadMessages()
})

function loadMessages() {
  let data = getChats()
  if (data.length === 0) {
    data = mockChatMessages
  }
  messages.value = data
  scrollToBottom()
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function sendMessage() {
  if (!inputText.value.trim()) return
  
  const userMessage: ChatMessage = {
    id: generateId(),
    content: inputText.value,
    isUser: true,
    createdAt: Date.now()
  }
  
  messages.value.push(userMessage)
  saveChatMessage(userMessage)
  inputText.value = ''
  scrollToBottom()
  
  isTyping.value = true
  
  setTimeout(() => {
    const aiMessage: ChatMessage = {
      id: generateId(),
      content: getAIResponse(userMessage.content),
      isUser: false,
      createdAt: Date.now()
    }
    
    messages.value.push(aiMessage)
    saveChatMessage(aiMessage)
    isTyping.value = false
    scrollToBottom()
  }, 1500)
}

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollToId.value = 'msg-' + messages.value[messages.value.length - 1].id
    }
  })
}
</script>

<style lang="scss" scoped>
.chat-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx;
}

.custom-nav {
  height: 88rpx;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
}

.chat-list {
  flex: 1;
  padding: 32rpx;
}

.message-item {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
  &.is-user {
    flex-direction: row-reverse;
    .message-content {
      background: #6b9ac4;
      border-radius: 24rpx 8rpx 24rpx 24rpx;
      .message-text {
        color: #ffffff;
      }
      .message-time {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.avatar-icon {
  font-size: 36rpx;
}

.message-content {
  max-width: 70%;
  background: #ffffff;
  border-radius: 8rpx 24rpx 24rpx 24rpx;
  padding: 20rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.message-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  display: block;
}

.message-time {
  font-size: 20rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
  text-align: right;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 24rpx;
  width: 240rpx;
  margin-bottom: 20rpx;
}

.typing-dots {
  display: flex;
  gap: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #999999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.typing-text {
  font-size: 24rpx;
  color: #999999;
}

.input-area {
  padding: 20rpx 32rpx;
  background: #ffffff;
}

.input-wrapper {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.chat-input {
  flex: 1;
  height: 80rpx;
  background: #f5f7fa;
  border-radius: 40rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
}

.send-btn {
  width: 80rpx;
  height: 80rpx;
  background: #e0e4e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &.active {
    background: #6b9ac4;
  }
  &:active {
    transform: scale(0.95);
  }
}

.send-icon {
  font-size: 36rpx;
  color: #ffffff;
}
</style>
