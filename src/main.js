import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        colors: {
          background: '#DBD2C9',
          primary: '#7F1D25',
          secondary: '#CD9395',
          accent: '#9F6162',
          error: '#63131C'
        }
      }
    }
  }
})

createApp(App).use(vuetify).mount('#app')