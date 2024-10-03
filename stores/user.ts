import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      loggedIn: false,
      apiToken: null,
      username: null
    } as {
      loggedIn: boolean
      apiToken: string | null
      username: string | null
    }
  },
  persist: true,
  actions: {
    async login(username: string, password: string) {
      try {
        const { token } = await useApi().auth.authControllerSignIn({
          username,
          password
        })
        this.setLoggedIn(true)
        this.setApiToken(token)
        this.setUsername(username)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
    logout() {
      this.setUsername(null)
      this.setLoggedIn(false)
      this.setApiToken(null)
    },
    setUsername(username: string | null) {
      this.username = username
    },
    setLoggedIn(loggedIn: boolean) {
      this.loggedIn = loggedIn
    },
    setApiToken(apiToken: string | null) {
      this.apiToken = apiToken
    }
  }
})
