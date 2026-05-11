<template>
  <view class="tab-bar safe-area-bottom">
    <view 
      v-for="item in tabs" 
      :key="item.path"
      class="tab-item"
      :class="{ active: currentPath === item.path }"
      @click="switchTab(item.path)"
    >
      <text class="tab-icon">{{ item.icon }}</text>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const currentPath = ref('/pages/diary/list')

const tabs = [
  { path: '/pages/diary/list', text: '日记', icon: '📝' },
  { path: '/pages/treehole/index', text: '树洞', icon: '🌳' },
  { path: '/pages/chat/index', text: 'AI', icon: '🤖' },
  { path: '/pages/stats/index', text: '统计', icon: '📊' },
  { path: '/pages/mine/index', text: '我的', icon: '👤' }
]

function switchTab(path: string) {
  if (currentPath.value === path) return
  currentPath.value = path
  uni.redirectTo({ url: path })
}

onMounted(() => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const page = pages[pages.length - 1]
    const route = '/' + page.route.replace(/\/pages/, 'pages')
    currentPath.value = route
  }
})
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.04);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 24rpx;
  transition: all 0.2s ease;
  &.active {
    .tab-icon {
      transform: scale(1.1);
    }
    .tab-text {
      color: #6b9ac4;
      font-weight: 500;
    }
  }
  &:active {
    opacity: 0.7;
  }
}

.tab-icon {
  font-size: 40rpx;
  transition: transform 0.2s ease;
}

.tab-text {
  font-size: 22rpx;
  color: #999999;
  transition: color 0.2s ease;
}
</style>
