import { useAuthStore } from "@/stores/auth";

export async function apiFetch(url, option = {}) {
  const authStore = useAuthStore()
  const token = authStore.token
  
  const headers = {
    ...apiFetch(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    authStore.logout()
    throw new Error('로그인이 필요합니다.')
  }

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || '요청 실패')
  }

  return res.json()
}