import { onBeforeUnmount, onMounted, ref } from 'vue'

const STORAGE_KEY = 'xiran-theme'

const applyTheme = (isDark) => {
  const html = document.documentElement
  const themeMeta = document.querySelector('meta[name="theme-color"]')

  if (isDark) {
    html.classList.add('dark')
    html.style.colorScheme = 'dark'
    if (themeMeta) {
      themeMeta.setAttribute('content', '#0b1220')
    }
  } else {
    html.classList.remove('dark')
    html.style.colorScheme = 'light'
    if (themeMeta) {
      themeMeta.setAttribute('content', '#fbfdff')
    }
  }
}

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored) {
    return stored === 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useTheme = () => {
  const isDark = ref(getInitialTheme())

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    applyTheme(isDark.value)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        isDark.value = event.matches
        applyTheme(isDark.value)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    onBeforeUnmount(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  return {
    isDark,
    toggleTheme,
  }
}
