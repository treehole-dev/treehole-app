const PASSWORD_KEY = 'anonymous_corner_password'
const USER_ID_KEY = 'anonymous_corner_user_id'
const DIARIES_KEY = 'anonymous_corner_diaries'
const TREEHOLES_KEY = 'anonymous_corner_treeholes'
const CHATS_KEY = 'anonymous_corner_chats'

export function setPassword(password: string): void {
  uni.setStorageSync(PASSWORD_KEY, password)
}

export function getPassword(): string | null {
  return uni.getStorageSync(PASSWORD_KEY) || null
}

export function hasPassword(): boolean {
  return !!getPassword()
}

export function generateUserId(): string {
  const adjectives = ['安静的', '温柔的', '孤独的', '沉默的', '迷茫的', '清醒的', '淡然的', '平静的']
  const nouns = ['星星', '月亮', '云朵', '微风', '雨滴', '雪花', '树叶', '影子']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  return `${adj}${noun}${num}`
}

export function getUserId(): string {
  let userId = uni.getStorageSync(USER_ID_KEY)
  if (!userId) {
    userId = generateUserId()
    uni.setStorageSync(USER_ID_KEY, userId)
  }
  return userId
}

export function setUserId(userId: string): void {
  uni.setStorageSync(USER_ID_KEY, userId)
}

export interface Diary {
  id: string
  content: string
  emotion: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'tired' | 'confused'
  createdAt: number
}

export function saveDiary(diary: Diary): void {
  const diaries = getDiaries()
  diaries.unshift(diary)
  uni.setStorageSync(DIARIES_KEY, JSON.stringify(diaries))
}

export function getDiaries(): Diary[] {
  const data = uni.getStorageSync(DIARIES_KEY)
  return data ? JSON.parse(data) : []
}

export function deleteDiary(id: string): void {
  const diaries = getDiaries().filter(d => d.id !== id)
  uni.setStorageSync(DIARIES_KEY, JSON.stringify(diaries))
}

export interface Treehole {
  id: string
  content: string
  likes: number
  createdAt: number
}

export function saveTreehole(treehole: Treehole): void {
  const treeholes = getTreeholes()
  treeholes.unshift(treehole)
  uni.setStorageSync(TREEHOLES_KEY, JSON.stringify(treeholes))
}

export function getTreeholes(): Treehole[] {
  const data = uni.getStorageSync(TREEHOLES_KEY)
  return data ? JSON.parse(data) : []
}

export function likeTreehole(id: string): void {
  const treeholes = getTreeholes().map(t => {
    if (t.id === id) {
      return { ...t, likes: t.likes + 1 }
    }
    return t
  })
  uni.setStorageSync(TREEHOLES_KEY, JSON.stringify(treeholes))
}

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  createdAt: number
}

export function saveChatMessage(message: ChatMessage): void {
  const chats = getChats()
  chats.push(message)
  uni.setStorageSync(CHATS_KEY, JSON.stringify(chats))
}

export function getChats(): ChatMessage[] {
  const data = uni.getStorageSync(CHATS_KEY)
  return data ? JSON.parse(data) : []
}

export function clearChats(): void {
  uni.setStorageSync(CHATS_KEY, '[]')
}

export function clearAllData(): void {
  uni.removeStorageSync(DIARIES_KEY)
  uni.removeStorageSync(TREEHOLES_KEY)
  uni.removeStorageSync(CHATS_KEY)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
