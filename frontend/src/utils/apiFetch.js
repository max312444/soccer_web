import { useAuthStore } from '@/stores/auth'

// 백엔드 API 주소 (중요)
const BASE_URL = 'http://localhost:7070/api'

export async function apiFetch(path, options = {}) {
  const authStore = useAuthStore()
  const token = authStore.token

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    authStore.logout()
    throw new Error('로그인이 필요합니다.')
  }

  if (!res.ok) {
    const errorMessage = await res.text()
    throw new Error(errorMessage || '요청 실패')
  }

  return res.json()
}
