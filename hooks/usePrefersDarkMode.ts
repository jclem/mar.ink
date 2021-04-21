import {useEffect, useState} from 'react'

export const usePrefersDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const onChange = (isDark: boolean) => {
      setIsDark(isDark)
    }
    onChange(window.darkModeNotifier.isDark)
    window.darkModeNotifier.addListener(onChange)
    return () => window.darkModeNotifier.removeListener(onChange)
  }, [])

  return isDark
}
