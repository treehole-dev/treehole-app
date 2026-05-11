<template>
  <view class="diary-container">
    <view class="custom-nav">
      <text class="nav-title">私密日记</text>
    </view>
    <view class="header">
      <view class="header-content">
        <text class="title">私密日记</text>
        <text class="subtitle">记录内心的声音</text>
      </view>
      <view class="add-btn" @click="goToNew">
        <text class="add-icon">+</text>
      </view>
    </view>
    
    <view class="diary-list" v-if="diaries.length > 0">
      <view 
        v-for="diary in diaries" 
        :key="diary.id" 
        class="diary-card"
        @longpress="showDelete(diary)"
      >
        <view class="diary-emotion" :style="{ background: getEmotionColor(diary.emotion) }">
          <text class="emotion-emoji">{{ getEmotionEmoji(diary.emotion) }}</text>
        </view>
        <view class="diary-content">
          <text class="diary-text">{{ diary.content }}</text>
          <text class="diary-time">{{ formatTime(diary.createdAt) }}</text>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <text class="empty-icon">📝</text>
      <text class="empty-title">还没有日记</text>
      <text class="empty-desc">记录下今天的心情吧</text>
      <view class="empty-btn" @click="goToNew">
        <text class="empty-btn-text">写第一篇日记</text>
      </view>
    </view>
    
    <view class="modal-overlay" v-if="showModal" @click="showModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">删除日记</text>
        <text class="modal-desc">确定要删除这篇日记吗？</text>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showModal = false">取消</view>
          <view class="modal-btn confirm" @click="confirmDelete">删除</view>
        </view>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onShow } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getDiaries, deleteDiary, type Diary } from '@/utils/storage'
import { emotionLabels, mockDiaries } from '@/data/mock'

const diaries = ref<Diary[]>([])
const showModal = ref(false)
const selectedDiary = ref<Diary | null>(null)

onMounted(() => {
  loadDiaries()
})

onShow(() => {
  loadDiaries()
})

function loadDiaries() {
  let data = getDiaries()
  if (data.length === 0) {
    data = mockDiaries
  }
  diaries.value = data
}

function goToNew() {
  uni.navigateTo({ url: '/pages/diary/new' })
}

function getEmotionColor(emotion: string) {
  return emotionLabels[emotion]?.color || '#999999'
}

function getEmotionEmoji(emotion: string) {
  return emotionLabels[emotion]?.emoji || '😐'
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - timestamp
  
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

function showDelete(diary: Diary) {
  selectedDiary.value = diary
  showModal.value = true
}

function confirmDelete() {
  if (selectedDiary.value) {
    deleteDiary(selectedDiary.value.id)
    diaries.value = diaries.value.filter(d => d.id !== selectedDiary.value?.id)
    showModal.value = false
    uni.showToast({ title: '已删除', icon: 'success' })
  }
}
</script>

<style lang="scss" scoped>
.diary-container {
  min-height: 100vh;
  background: #f5f7fa;
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

.header {
  background: linear-gradient(135deg, #6b9ac4 0%, #8bb3d4 100%);
  padding: 60rpx 32rpx 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  color: #ffffff;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 26rpx;
  opacity: 0.85;
}

.add-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.3);
  }
}

.add-icon {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: 300;
}

.diary-list {
  padding: 32rpx;
  margin-top: -40rpx;
}

.diary-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.diary-emotion {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emotion-emoji {
  font-size: 40rpx;
}

.diary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.diary-text {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.diary-time {
  font-size: 24rpx;
  color: #999999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 60rpx;
}

.empty-icon {
  font-size: 100rpx;
  margin-bottom: 32rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 48rpx;
}

.empty-btn {
  background: #6b9ac4;
  color: #ffffff;
  padding: 28rpx 64rpx;
  border-radius: 44rpx;
  transition: all 0.2s ease;
  &:active {
    transform: scale(0.95);
    background: #5a85b0;
  }
}

.empty-btn-text {
  font-size: 30rpx;
  font-weight: 500;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 560rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 48rpx;
  text-align: center;
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.modal-desc {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 48rpx;
}

.modal-actions {
  display: flex;
  gap: 24rpx;
}

.modal-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  &.cancel {
    background: #f5f7fa;
    color: #666666;
  }
  &.confirm {
    background: #f56c6c;
    color: #ffffff;
  }
}
</style>
