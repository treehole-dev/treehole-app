<template>
  <view class="mine-container">
    <view class="custom-nav">
      <text class="nav-title">我的</text>
    </view>
    <view class="header">
      <view class="user-info">
        <view class="avatar">
          <text class="avatar-icon">🌙</text>
        </view>
        <view class="user-detail">
          <text class="user-id">{{ userId }}</text>
          <text class="user-desc">匿名用户</text>
        </view>
      </view>
      <view class="edit-btn" @click="showEditId = true">
        <text class="edit-icon">✏️</text>
      </view>
    </view>
    
    <view class="menu-list">
      <view class="menu-item" @click="showPasswordModal = true">
        <view class="menu-icon">🔐</view>
        <text class="menu-text">应用密码</text>
        <text class="menu-arrow">›</text>
        <text class="menu-status">{{ hasPassword ? '已开启' : '未设置' }}</text>
      </view>
      
      <view class="menu-item" @click="showClearModal = true">
        <view class="menu-icon">🗑️</view>
        <text class="menu-text">数据管理</text>
        <text class="menu-arrow">›</text>
      </view>
      
      <view class="menu-item">
        <view class="menu-icon">📊</view>
        <text class="menu-text">数据统计</text>
        <text class="menu-arrow">›</text>
      </view>
      
      <view class="menu-item">
        <view class="menu-icon">📖</view>
        <text class="menu-text">使用说明</text>
        <text class="menu-arrow">›</text>
      </view>
      
      <view class="menu-item">
        <view class="menu-icon">ℹ️</view>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
    
    <view class="footer">
      <text class="version">匿名角落 v1.0.0</text>
      <text class="privacy">您的隐私安全是我们的首要任务</text>
    </view>
    
    <view class="modal-overlay" v-if="showEditId" @click="showEditId = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">更换匿名ID</text>
        <input 
          class="modal-input"
          v-model="newId"
          placeholder="输入新的匿名ID"
          maxlength="20"
        />
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showEditId = false">取消</view>
          <view class="modal-btn confirm" @click="changeUserId">确定</view>
        </view>
      </view>
    </view>
    
    <view class="modal-overlay" v-if="showPasswordModal" @click="showPasswordModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">{{ hasPassword ? '修改密码' : '设置密码' }}</text>
        <input 
          class="modal-input"
          v-model="password"
          type="number"
          placeholder="请输入4位数字密码"
          maxlength="4"
        />
        <input 
          class="modal-input"
          v-model="confirmPassword"
          type="number"
          placeholder="确认密码"
          maxlength="4"
          v-if="!hasPassword"
        />
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showPasswordModal = false">取消</view>
          <view class="modal-btn confirm" @click="savePassword">确定</view>
        </view>
      </view>
    </view>
    
    <view class="modal-overlay" v-if="showClearModal" @click="showClearModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">清除数据</text>
        <text class="modal-desc">此操作将清除所有日记、树洞和聊天记录，且无法恢复。确定要继续吗？</text>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="showClearModal = false">取消</view>
          <view class="modal-btn confirm danger" @click="clearData">确定</view>
        </view>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getUserId, setUserId, setPassword, hasPassword as checkPassword, clearAllData } from '@/utils/storage'

const userId = ref('')
const hasPassword = ref(false)
const showEditId = ref(false)
const showPasswordModal = ref(false)
const showClearModal = ref(false)
const newId = ref('')
const password = ref('')
const confirmPassword = ref('')

onMounted(() => {
  userId.value = getUserId()
  hasPassword.value = checkPassword()
})

function changeUserId() {
  if (!newId.value.trim()) {
    uni.showToast({ title: '请输入ID', icon: 'none' })
    return
  }
  setUserId(newId.value)
  userId.value = newId.value
  showEditId.value = false
  uni.showToast({ title: '已更换', icon: 'success' })
}

function savePassword() {
  if (!password.value || password.value.length !== 4) {
    uni.showToast({ title: '请输入4位数字', icon: 'none' })
    return
  }
  
  if (!hasPassword.value && password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  
  setPassword(password.value)
  hasPassword.value = true
  showPasswordModal.value = false
  uni.showToast({ title: '设置成功', icon: 'success' })
}

function clearData() {
  clearAllData()
  showClearModal.value = false
  uni.showToast({ title: '已清除', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.mine-container {
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
  background: linear-gradient(135deg, #5a6673 0%, #788594 100%);
  padding: 60rpx 32rpx 80rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 50rpx;
}

.user-detail {
  color: #ffffff;
}

.user-id {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 24rpx;
  opacity: 0.85;
}

.edit-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.edit-icon {
  font-size: 28rpx;
}

.menu-list {
  margin: -40rpx 32rpx 32rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  &:active {
    background: #f9fafb;
  }
}

.menu-icon {
  font-size: 36rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 36rpx;
  color: #cccccc;
}

.menu-status {
  font-size: 26rpx;
  color: #999999;
}

.footer {
  padding: 60rpx 32rpx;
  text-align: center;
}

.version {
  display: block;
  font-size: 24rpx;
  color: #999999;
  margin-bottom: 12rpx;
}

.privacy {
  font-size: 22rpx;
  color: #cccccc;
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
}

.modal-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 32rpx;
  text-align: center;
}

.modal-input {
  width: 100%;
  height: 88rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  margin-bottom: 24rpx;
}

.modal-desc {
  display: block;
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 48rpx;
  text-align: center;
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
    &.danger {
      background: #f56c6c;
    }
  }
}
</style>
