import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

import App from './App.vue'
import router from './router'
import { setAccessTokenGetter } from './services/api'

const app = createApp(App)

app.use(createPinia())

const auth0Plugin = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    redirect_uri: window.location.origin + import.meta.env.BASE_URL
  }
})

app.use(auth0Plugin)

// Set up token getter for API requests
app.config.globalProperties.$auth0 = auth0Plugin
if (app.config.globalProperties.$auth0) {
  const auth0 = app.config.globalProperties.$auth0
  setAccessTokenGetter(async () => {
    try {
      return await auth0.getAccessTokenSilently()
    } catch (error) {
      console.error('Token fetch failed:', error)
      return null
    }
  })
}

app.use(router)

app.mount('#app')