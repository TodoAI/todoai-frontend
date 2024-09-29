import { defineStore } from 'pinia'
import type { UserInfo } from '~/composables/generated/Api'
import { ApiError, useApi } from '~/composables/useApi'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      loggedIn: false,
      apiToken: null,
      userInfo: null
    } as {
      loggedIn: boolean
      apiToken: string | null
      userInfo: UserInfo | null
    }
  },
  persist: true,
  actions: {
    async login(myEfreiCookie: string, runtimeConfig: any = useRuntimeConfig()) {
      try {
        const { success, token, error } = await useApi(runtimeConfig).auth.authControllerSetCookie({ cookie: myEfreiCookie })
        if (!token) {
          return { success, error }
        }
        this.setApiToken(token)
        const userInfo = await useApi(runtimeConfig).user.userControllerGetMe()
        this.setUserInfo(userInfo)
        this.setLoggedIn(true)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
    async loginWithMyEfreeToken(token: string, runtimeConfig: any = useRuntimeConfig()) {
      try {
        this.setApiToken(token)
        const userInfo = await useApi(runtimeConfig).user.userControllerGetMe()
        this.setUserInfo(userInfo)
        this.setLoggedIn(true)
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
    async loginWithCredentials(username: string, password: string, runtimeConfig: any = useRuntimeConfig()) {
      try {
        // const { token } = await useApi(runtimeConfig).auth.myefrei.login(username, password);
        // this.setApiToken(token);
        const userInfo = await useApi(runtimeConfig).user.userControllerGetMe()
        this.setUserInfo(userInfo)
        this.setLoggedIn(true)
        return { success: true, error: null }
      } catch (e: any) {
        if (e instanceof ApiError) {
          console.error(e)
          return { success: false, error: e.error?.error || 'Une erreur inconnue est survenue' }
        } else {
          console.error(e)
          return { success: false, error: 'Une erreur inconnue est survenue' }
        }
      }
    },
    logout(toast: boolean = true) {
      this.setUserInfo(null)
      this.setLoggedIn(false)
      this.setApiToken(null)
      useDataStore().voidData()

      const { add } = useToast()

      if (toast) {
        add({
          title: 'Vous avez été déconnecté !'
        })
        navigateTo('/login')
      }
    },
    setUserInfo(userInfo: UserSchema | null) {
      this.userInfo = userInfo
    },
    setLoggedIn(loggedIn: boolean) {
      this.loggedIn = loggedIn
    },
    setApiToken(apiToken: string | null) {
      this.apiToken = apiToken
    }
  }
})
