import NextApp from 'next/app'
import Head from 'next/head'
import '../styles/app.css'

declare global {
  interface Window {
    darkModeNotifier: {
      isDark: boolean
      addListener: (listener: (isDark: boolean) => void) => void
      removeListener: (listener: (isDark: boolean) => void) => void
    }
  }
}

const script = `
(() => {
  class DarkModeNotifier {
    constructor() {
      this.mql = matchMedia('(prefers-color-scheme: dark)')
      this.isDark = this.checkIsDark()
      this.listeners = new Set()
      this.onChange()
      this.mql.addEventListener('change', this.onChange.bind(this))
    }

    checkIsDark() {
      const queryRequestsDark = new URLSearchParams(location.search).get('darkMode')

      if (queryRequestsDark === '1' || queryRequestsDark === 'true') {
        return true
      } else if (queryRequestsDark === '0' || queryRequestsDark === 'false') {
        return false
      } else {
        return this.mql.matches
      }

    }

    onChange(match) {
      const queryRequestsDark = new URLSearchParams(location.search).get('darkMode')

      let isDark
      if (this.checkIsDark()) {
        isDark = true
        document.documentElement.classList.add('dark')
      } else {
        isDark = false
        document.documentElement.classList.remove('dark')
      }

      for (const listener of this.listeners) listener(isDark)
    }

    addListener(listener) {
      this.listeners.add(listener)
    }

    removeListener(listener) {
      this.listeners.delete(listener)
    }
  }

  window.darkModeNotifier = new DarkModeNotifier()
})()
`

export default class App extends NextApp {
  render() {
    const {Component, pageProps} = this.props

    return (
      <>
        <Head>
          <title>mar.ink | Mermaid Diagrams</title>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <script dangerouslySetInnerHTML={{__html: script}} />
        </Head>
        <Component {...pageProps} />
      </>
    )
  }
}
