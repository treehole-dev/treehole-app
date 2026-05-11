<template>
  <view class="new-diary-container">
    <view class="custom-nav">
      <text class="nav-title">写日记</text>
      <view class="save-btn" @click="saveDiary">
        <text class="save-text">保存</text>
      </view>
    </view>
    
    <view class="content-area">
      <textarea 
        class="diary-input"
        v-model="content"
        placeholder="写下你今天的心情..."
        :maxlength="1000"
        auto-height
      />
    </view>
    
    <view class="emotion-section">
      <text class="section-title">今天的情绪</text>
      <view class="emotion-list">
        <view 
          v-for="(info, key) in emotionLabels" 
          :key="key"
          class="emotion-item"
          :class="{ active: selectedEmotion === key }"
          @click="selectedEmotion = key as any"
        >
          <text class="emotion-emoji">{{ info.emoji }}</text>
          <text class="emotion-label">{{ info.label }}</text>
        </view>
      </view>
    </view>
    
    <view class="footer">
      <view class="char-count">{{ content.length }}/1000</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { saveDiary as saveDiaryToStorage, generateId, type Diary } from '@/utils/storage'
import { emotionLabels } from '@/data/mock'

const content = ref('')
const selectedEmotion = ref<'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'tired' | 'confused'>('calm')

function saveDiary() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  const diary: Diary = {
    id: generateId(),
    content: content.value,
    emotion: selectedEmotion.value,
    createdAt: Date.now()
  }
  
  try {
    saveDiaryToStorage(diary)
    uni.showToast({ title: '保存成功', icon: 'success', duration: 1500 })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    console.error('Save diary error:', error)
  }
}
</script>

<style lang="scss" scoped>
.new-diary-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.custom-nav {
  height: 88rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
}

.save-btn {
  padding: 12rpx 28rpx;
  background: #6b9ac4;
  border-radius: 32rpx;
  &:active {
    background: #5a85b0;
  }
}

.save-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 32rpx;
}

.diary-input {
  width: 100%;
  min-height: 500rpx;
  font-size: 30rpx;
  line-height: 1.8;
  color: #333333;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  box-sizing: border-box;
}

.emotion-section {
  padding: 0 32rpx 32rpx;
}

.section-title {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.emotion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.emotion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 28rpx;
  background: #ffffff;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
  &.active {
    border-color: #6b9ac4;
    background: rgba(107, 154, 196, 0.05);
  }
  &:active {
    transform: scale(0.95);
  }
}

.emotion-emoji {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.emotion-label {
  font-size: 24rpx;
  color: #666666;
}

.footer {
  padding: 20rpx 32rpx;
  background: #ffffff;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.char-count {
  font-size: 24rpx;
  color: #999999;
  text-align: right;
}
</style>
