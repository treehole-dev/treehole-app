<template>
  <view class="treehole-container">
    <view class="custom-nav">
      <text class="nav-title">公开树洞</text>
    </view>
    <view class="header">
      <view class="header-content">
        <text class="title">公开树洞</text>
        <text class="subtitle">倾听陌生人的心声</text>
      </view>
      <view class="publish-btn" @click="goToPublish">
        <text class="publish-icon">✏️</text>
      </view>
    </view>
    
    <view class="treehole-list" v-if="treeholes.length > 0">
      <view 
        v-for="treehole in treeholes" 
        :key="treehole.id" 
        class="treehole-card"
      >
        <text class="treehole-content">{{ treehole.content }}</text>
        <view class="treehole-footer">
          <text class="treehole-time">{{ formatTime(treehole.createdAt) }}</text>
          <view 
            class="like-btn" 
            :class="{ liked: isLiked(treehole.id) }"
            @click="handleLike(treehole)"
          >
            <text class="like-icon">❤️</text>
            <text class="like-count">{{ treehole.likes }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <text class="empty-icon">🌳</text>
      <text class="empty-title">树洞里还很安静</text>
      <text class="empty-desc">成为第一个倾诉的人吧</text>
      <view class="empty-btn" @click="goToPublish">
        <text class="empty-btn-text">发布树洞</text>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getTreeholes, likeTreehole, type Treehole } from '@/utils/storage'
import { mockTreeholes } from '@/data/mock'

const treeholes = ref<Treehole[]>([])
const likedIds = ref<string[]>([])

onMounted(() => {
  loadTreeholes()
})

function loadTreeholes() {
  let data = getTreeholes()
  if (data.length === 0) {
    data = mockTreeholes
  }
  treeholes.value = data
}

function goToPublish() {
  uni.navigateTo({ url: '/pages/treehole/publish' })
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

function isLiked(id: string) {
  return likedIds.value.includes(id)
}

function handleLike(treehole: Treehole) {
  if (isLiked(treehole.id)) return
  
  likedIds.value.push(treehole.id)
  treehole.likes++
  likeTreehole(treehole.id)
}

uni.$on('treeholeAdded', () => {
  loadTreeholes()
})
</script>

<style lang="scss" scoped>
.treehole-container {
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
  background: linear-gradient(135deg, #718096 0%, #94a3b8 100%);
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

.publish-btn {
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

.publish-icon {
  font-size: 36rpx;
}

.treehole-list {
  padding: 32rpx;
  margin-top: -40rpx;
}

.treehole-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.treehole-content {
  font-size: 30rpx;
  color: #333333;
  line-height: 1.8;
  margin-bottom: 24rpx;
}

.treehole-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.treehole-time {
  font-size: 24rpx;
  color: #999999;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.2s ease;
  &.liked {
    background: rgba(245, 108, 108, 0.1);
  }
  &:active {
    transform: scale(0.95);
  }
}

.like-icon {
  font-size: 28rpx;
  opacity: 0.6;
  .liked & {
    opacity: 1;
  }
}

.like-count {
  font-size: 24rpx;
  color: #999999;
  .liked & {
    color: #f56c6c;
  }
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
  background: #718096;
  color: #ffffff;
  padding: 28rpx 64rpx;
  border-radius: 44rpx;
  transition: all 0.2s ease;
  &:active {
    transform: scale(0.95);
    background: #5d6d7e;
  }
}

.empty-btn-text {
  font-size: 30rpx;
  font-weight: 500;
}
</style>
