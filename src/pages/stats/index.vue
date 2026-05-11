<template>
  <view class="stats-container">
    <view class="custom-nav">
      <text class="nav-title">情绪统计</text>
    </view>
    <view class="header">
      <text class="title">情绪统计</text>
      <text class="subtitle">了解你的内心变化</text>
    </view>
    
    <view class="stats-content">
      <view class="section">
        <text class="section-title">情绪分布</text>
        <view class="pie-chart-wrapper">
          <canvas canvas-id="pieChart" class="pie-chart"></canvas>
          <view class="pie-center">
            <text class="pie-total">{{ totalDiaries }}</text>
            <text class="pie-label">日记总数</text>
          </view>
        </view>
        <view class="legend">
          <view 
            v-for="(info, key) in emotionLabels" 
            :key="key"
            class="legend-item"
          >
            <view class="legend-dot" :style="{ background: info.color }"></view>
            <text class="legend-label">{{ info.label }}</text>
            <text class="legend-value">{{ getEmotionCount(key) }}</text>
          </view>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">近7天趋势</text>
        <view class="chart-wrapper">
          <canvas canvas-id="trendChart" class="trend-chart"></canvas>
        </view>
        <view class="day-labels">
          <text v-for="day in weekDays" :key="day" class="day-label">{{ day }}</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">最近记录</text>
        <view class="recent-list" v-if="recentDiaries.length > 0">
          <view 
            v-for="diary in recentDiaries" 
            :key="diary.id" 
            class="recent-item"
          >
            <view class="recent-emotion" :style="{ background: getEmotionColor(diary.emotion) }">
              <text class="emotion-emoji">{{ getEmotionEmoji(diary.emotion) }}</text>
            </view>
            <view class="recent-content">
              <text class="recent-text">{{ diary.content }}</text>
              <text class="recent-time">{{ formatTime(diary.createdAt) }}</text>
            </view>
          </view>
        </view>
        <view class="empty-recent" v-else>
          <text class="empty-text">还没有记录</text>
        </view>
      </view>
    </view>
    
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TabBar from '@/components/TabBar.vue'
import { getDiaries, type Diary } from '@/utils/storage'
import { emotionLabels, mockDiaries } from '@/data/mock'

const diaries = ref<Diary[]>([])

onMounted(() => {
  loadDiaries()
})

function loadDiaries() {
  let data = getDiaries()
  if (data.length === 0) {
    data = mockDiaries
  }
  diaries.value = data
  drawPieChart()
  drawTrendChart()
}

const totalDiaries = computed(() => diaries.value.length)

const recentDiaries = computed(() => diaries.value.slice(0, 5))

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

function getEmotionCount(emotion: string) {
  return diaries.value.filter(d => d.emotion === emotion).length
}

function getEmotionColor(emotion: string) {
  return emotionLabels[emotion]?.color || '#999999'
}

function getEmotionEmoji(emotion: string) {
  return emotionLabels[emotion]?.emoji || '😐'
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function drawPieChart() {
  const ctx = uni.createCanvasContext('pieChart')
  const centerX = 150
  const centerY = 150
  const radius = 120
  
  const emotions = Object.keys(emotionLabels)
  let startAngle = 0
  
  emotions.forEach(emotion => {
    const count = getEmotionCount(emotion)
    if (count === 0) return
    
    const total = totalDiaries.value
    const sliceAngle = (count / total) * Math.PI * 2
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
    ctx.closePath()
    ctx.setFillStyle(emotionLabels[emotion].color)
    ctx.fill()
    
    startAngle += sliceAngle
  })
  
  ctx.draw()
}

function drawTrendChart() {
  const ctx = uni.createCanvasContext('trendChart')
  const width = 650
  const height = 200
  const padding = 20
  
  const today = new Date()
  const weekData: number[] = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    
    const count = diaries.value.filter(d => {
      const dDate = new Date(d.createdAt)
      const dStr = `${dDate.getFullYear()}-${(dDate.getMonth() + 1).toString().padStart(2, '0')}-${dDate.getDate().toString().padStart(2, '0')}`
      return dStr === dateStr
    }).length
    
    weekData.push(count)
  }
  
  const maxValue = Math.max(...weekData, 1)
  const barWidth = (width - padding * 2) / 7 - 10
  
  ctx.setFillStyle('#f5f7fa')
  ctx.fillRect(0, 0, width, height)
  
  for (let i = 0; i < weekData.length; i++) {
    const value = weekData[i]
    const barHeight = (value / maxValue) * (height - padding * 2)
    const x = padding + i * (barWidth + 10)
    const y = height - padding - barHeight
    
    const gradient = ctx.createLinearGradient(x, y, x, height - padding)
    gradient.addColorStop(0, '#6b9ac4')
    gradient.addColorStop(1, '#8bb3d4')
    
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, 8)
    ctx.setFillStyle(gradient)
    ctx.fill()
  }
  
  ctx.draw()
}
</script>

<style lang="scss" scoped>
.stats-container {
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
  background: linear-gradient(135deg, #9b59b6 0%, #b37fcb 100%);
  padding: 60rpx 32rpx 48rpx;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
}

.stats-content {
  padding: 32rpx;
}

.section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.pie-chart-wrapper {
  position: relative;
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto 24rpx;
}

.pie-chart {
  width: 100%;
  height: 100%;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-total {
  display: block;
  font-size: 48rpx;
  font-weight: 600;
  color: #333333;
}

.pie-label {
  font-size: 24rpx;
  color: #999999;
}

.legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.legend-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 4rpx;
}

.legend-label {
  flex: 1;
  font-size: 26rpx;
  color: #666666;
}

.legend-value {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
}

.chart-wrapper {
  height: 400rpx;
  margin-bottom: 16rpx;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

.day-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 20rpx;
}

.day-label {
  font-size: 24rpx;
  color: #999999;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.recent-item {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background: #f9fafb;
  border-radius: 16rpx;
}

.recent-emotion {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emotion-emoji {
  font-size: 32rpx;
}

.recent-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.recent-text {
  font-size: 26rpx;
  color: #333333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recent-time {
  font-size: 22rpx;
  color: #999999;
}

.empty-recent {
  text-align: center;
  padding: 48rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}
</style>
