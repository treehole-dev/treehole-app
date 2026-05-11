<template>
  <view class="publish-container">
    <view class="toolbar">
      <view class="tool-btn" @click="goBack">
        <text class="tool-text">取消</text>
      </view>
      <view class="tool-btn primary" @click="publish">
        <text class="tool-text">发布</text>
      </view>
    </view>
    
    <view class="content-area">
      <textarea 
        class="treehole-input"
        v-model="content"
        placeholder="在这里说出你的心声...（发布后不可修改或删除）"
        :maxlength="500"
        auto-height
      />
    </view>
    
    <view class="tips">
      <text class="tip-icon">💡</text>
      <text class="tip-text">匿名发布，保护您的隐私</text>
    </view>
    
    <view class="footer safe-area-bottom">
      <view class="char-count">{{ content.length }}/500</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { saveTreehole, generateId, type Treehole } from '@/utils/storage'

const content = ref('')

function goBack() {
  uni.navigateBack()
}

function publish() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  
  const treehole: Treehole = {
    id: generateId(),
    content: content.value,
    likes: 0,
    createdAt: Date.now()
  }
  
  saveTreehole(treehole)
  uni.$emit('treeholeAdded')
  uni.showToast({ title: '发布成功', icon: 'success' })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.publish-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 20rpx 32rpx;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
}

.tool-btn {
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  background: #f5f7fa;
  &.primary {
    background: #718096;
    .tool-text {
      color: #ffffff;
    }
  }
  &:active {
    opacity: 0.8;
  }
}

.tool-text {
  font-size: 28rpx;
  color: #666666;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 32rpx;
}

.treehole-input {
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

.tips {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 32rpx;
  margin-bottom: 20rpx;
}

.tip-icon {
  font-size: 28rpx;
}

.tip-text {
  font-size: 24rpx;
  color: #999999;
}

.footer {
  padding: 20rpx 32rpx;
  background: #ffffff;
}

.char-count {
  font-size: 24rpx;
  color: #999999;
  text-align: right;
}
</style>
