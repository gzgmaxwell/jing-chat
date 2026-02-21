import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { useLocalStorage } from '@vueuse/core'

const token = useLocalStorage(STORAGE_TOKEN_KEY, {
  token: '',
})

interface LocalStorageToken {
  token: string
}

function isLogin() {
  return !!token.value.token
}

function getToken() {
  return token.value
}

function setToken(newToken: LocalStorageToken) {
  token.value = newToken
}

function clearToken() {
  token.value.token = null
}

export { isLogin, getToken, setToken, clearToken }
