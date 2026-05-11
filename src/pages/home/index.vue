<template>
  <view class="home-container">
    <view class="custom-nav">
      <text class="nav-title">匿名角落</text>
    </view>
    
    <view class="hero-section">
      <view class="hero-icon">🌿</view>
      <text class="hero-title">匿名角落</text>
      <text class="hero-subtitle">在这里，做真实的自己</text>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="goToDiary">
        <view class="action-icon">📝</view>
        <text class="action-text">写日记</text>
      </view>
      <view class="action-card" @click="goToTreehole">
        <view class="action-icon">🌳</view>
        <text class="action-text">看树洞</text>
      </view>
      <view class="action-card" @click="goToChat">
        <view class="action-icon">🤖</view>
        <text class="action-text">AI聊天</text>
      </view>
    </view>
    
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ diaryCount }}</text>
        <text class="stat-label">日记篇数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ treeholeCount }}</text>
        <text class="stat-label">树洞条数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ chatCount }}</text>
        <text class="stat-label">聊天次数</text>
      </view>
    </view>
    
    <view class="tips-section">
      <text class="tips-title">💡 使用提示</text>
      <view class="tips-list">
        <text class="tip-item">• 无需注册，打开即用</text>
        <text class="tip-item">• 所有数据本地存储</text>
        <text class="tip-item">• 支持设置应用密码</text>
        <text class="tip-item">• 完全匿名，保护隐私</text>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getDiaries, getTreeholes, getChats } from '@/utils/storage'

const diaryCount = ref(0)
const treeholeCount = ref(0)
const chatCount = ref(0)

onMounted(() => {
  diaryCount.value = getDiaries().length
  treeholeCount.value = getTreeholes().length
  chatCount.value = getChats().length
})

function goToDiary() {
  uni.redirectTo({ url: '/pages/diary/list' })
}

function goToTreehole() {
  uni.redirectTo({ url: '/pages/treehole/index' })
}

function goToChat() {
  uni.redirectTo({ url: '/pages/chat/index' })
}
</script>

<style lang="scss" scoped>
.home-container {
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

.hero-section {
  background: linear-gradient(135deg, #6b9ac4 0%, #8bb3d4 100%);
  padding: 80rpx 32rpx 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.hero-icon {
  font-size: 100rpx;
  margin-bottom: 16rpx;
}

.hero-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin: -50rpx 32rpx 32rpx;
}

.action-card {
  width: 160rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  &:active {
    transform: scale(0.95);
    background: #f9fafb;
  }
}

.action-icon {
  font-size: 48rpx;
}

.action-text {
  font-size: 26rpx;
  color: #333333;
}

.stats-section {
  background: #ffffff;
  margin: 0 32rpx 32rpx;
  border-radius: 20rpx;
  padding: 40rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 600;
  color: #333333;
}

.stat-label {
  font-size: 24rpx;
  color: #999999;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #e0e4e8;
}

.tips-section {
  background: #ffffff;
  margin: 0 32rpx;
  border-radius: 20rpx;
  padding: 32rpx;
}

.tips-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.6;
}
</style>
