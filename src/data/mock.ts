import type { Diary, Treehole, ChatMessage } from '@/utils/storage'
import { generateId } from '@/utils/storage'

export const mockDiaries: Diary[] = [
  {
    id: generateId(),
    content: '今天阳光很好，一个人坐在公园的长椅上看云，很平静。有时候孤独也挺好的，不用说话，不用迎合任何人。',
    emotion: 'calm',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: generateId(),
    content: '又失眠了，脑子里乱糟糟的。害怕明天的社交场合，害怕与人交流，害怕被评价...',
    emotion: 'anxious',
    createdAt: Date.now() - 86400000
  },
  {
    id: generateId(),
    content: '今天尝试主动和同事打了招呼，虽然只是简单的问候，但对我来说已经是很大的进步了。给自己加油！',
    emotion: 'happy',
    createdAt: Date.now() - 3600000
  }
]

export const mockTreeholes: Treehole[] = [
  {
    id: generateId(),
    content: '在这里说说话，不用在意任何人的看法。有时候觉得自己像隐形人，没有人真正理解我。',
    likes: 23,
    createdAt: Date.now() - 3600000
  },
  {
    id: generateId(),
    content: '回避型人格真的好累啊...明明很想靠近，却又下意识地推开。',
    likes: 56,
    createdAt: Date.now() - 7200000
  },
  {
    id: generateId(),
    content: '今天在地铁上被陌生人不小心撞到，对方道歉了，我却一句话也说不出来，只是僵硬地点了点头。回到家后一直在想，当时应该说"没关系"的...',
    likes: 89,
    createdAt: Date.now() - 10800000
  },
  {
    id: generateId(),
    content: '周末宅在家里，连外卖都不想点。不是不想吃，是不想和外卖员说话。',
    likes: 124,
    createdAt: Date.now() - 14400000
  },
  {
    id: generateId(),
    content: '其实我很羡慕那些能轻松社交的人，他们看起来那么自然，那么自信。',
    likes: 67,
    createdAt: Date.now() - 18000000
  }
]

export const mockChatMessages: ChatMessage[] = [
  {
    id: generateId(),
    content: '你好呀，我是你的AI陪伴。这里是一个安全、无压力的空间，你可以放心地和我聊聊任何事情。',
    isUser: false,
    createdAt: Date.now() - 7200000
  },
  {
    id: generateId(),
    content: '你好，我最近感觉很焦虑...',
    isUser: true,
    createdAt: Date.now() - 7000000
  },
  {
    id: generateId(),
    content: '谢谢你愿意和我分享。焦虑是很正常的情绪，很多人都会有。你可以具体说说是什么让你感到焦虑吗？我在这里听你说。',
    isUser: false,
    createdAt: Date.now() - 6800000
  }
]

export const emotionLabels: Record<string, { label: string; color: string; emoji: string }> = {
  happy: { label: '开心', color: '#ffd93d', emoji: '😊' },
  calm: { label: '平静', color: '#6b9ac4', emoji: '😌' },
  anxious: { label: '焦虑', color: '#ffa502', emoji: '😰' },
  sad: { label: '低落', color: '#718096', emoji: '😢' },
  angry: { label: '愤怒', color: '#f56c6c', emoji: '😤' },
  tired: { label: '疲惫', color: '#95a5a6', emoji: '😴' },
  confused: { label: '迷茫', color: '#9b59b6', emoji: '😕' }
}

export function getAIResponse(input: string): string {
  const responses = [
    '我理解你的感受，有时候生活确实会让人感到疲惫。',
    '谢谢你愿意分享这些，你的感受很重要。',
    '我在这里陪伴着你，不用着急，慢慢说。',
    '听起来你经历了很多，能够说出来已经很勇敢了。',
    '每个人都有自己的节奏，不用强迫自己迎合别人。',
    '你的情绪是真实的，值得被看见和理解。',
    '有时候沉默也是一种表达，不需要刻意找话题。',
    '你并不孤单，这里有我陪着你。'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
