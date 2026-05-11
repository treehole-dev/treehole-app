<template>
  <view class="unlock-container">
    <view class="header">
      <text class="title">解锁</text>
      <text class="subtitle">请输入应用密码</text>
    </view>
    
    <view class="password-input-wrapper">
      <view class="password-display">
        <view 
          v-for="i in 4" 
          :key="i" 
          class="password-dot"
          :class="{ active: password.length >= i }"
        ></view>
      </view>
      <text class="error-text" v-if="error">{{ error }}</text>
    </view>
    
    <view class="keypad">
      <view 
        v-for="key in keypad" 
        :key="key" 
        class="key-item"
        @click="handleKeyPress(key)"
      >
        <text class="key-text">{{ key }}</text>
      </view>
    </view>
    
    <view class="footer">
      <text class="forgot-link" @click="showForgotModal = true">忘记密码？</text>
    </view>
    
    <view class="modal-overlay" v-if="showForgotModal" @click="showForgotModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">重置密码</text>
        <text class="modal-desc">重置密码将清除所有本地数据，确定要继续吗？</text>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showForgotModal = false">取消</view>
          <view class="modal-btn confirm" @click="resetPassword">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getPassword, setPassword, clearAllData } from '@/utils/storage'

const password = ref('')
const error = ref('')
const showForgotModal = ref(false)
const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete']

function handleKeyPress(key: string) {
  if (key === 'delete') {
    password.value = password.value.slice(0, -1)
    error.value = ''
  } else if (key === '') {
    return
  } else if (password.value.length < 4) {
    password.value += key
    error.value = ''
    if (password.value.length === 4) {
      validatePassword()
    }
  }
}

function validatePassword() {
  const storedPassword = getPassword()
  if (password.value === storedPassword) {
    uni.switchTab({ url: '/pages/diary/list' })
  } else {
    error.value = '密码错误'
    setTimeout(() => {
      password.value = ''
      error.value = ''
    }, 1000)
  }
}

function resetPassword() {
  clearAllData()
  setPassword('')
  showForgotModal.value = false
  uni.switchTab({ url: '/pages/diary/list' })
}
</script>

<style lang="scss" scoped>
.unlock-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  padding: 120rpx 60rpx 60rpx;
}

.header {
  text-align: center;
  margin-bottom: 100rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999999;
}

.password-input-wrapper {
  margin-bottom: 60rpx;
}

.password-display {
  display: flex;
  justify-content: center;
  gap: 32rpx;
}

.password-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: #e0e4e8;
  transition: all 0.2s ease;
  &.active {
    background: #6b9ac4;
  }
}

.error-text {
  display: block;
  text-align: center;
  color: #f56c6c;
  font-size: 24rpx;
  margin-top: 24rpx;
}

.keypad {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24rpx;
}

.key-item {
  width: 140rpx;
  height: 140rpx;
  background: #ffffff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  &:active {
    transform: scale(0.95);
    background: #f0f2f5;
  }
}

.key-text {
  font-size: 44rpx;
  color: #333333;
}

.footer {
  margin-top: auto;
  text-align: center;
}

.forgot-link {
  font-size: 26rpx;
  color: #6b9ac4;
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
  line-height: 1.6;
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
    background: #6b9ac4;
    color: #ffffff;
  }
}
</style>
