import MonacoEditor, {BeforeMount, OnChange} from '@monaco-editor/react'
import React, {useCallback, VFC} from 'react'
import {usePrefersDarkMode} from '../hooks/usePrefersDarkMode'
import {mermaidLanguage} from '../mermaidLang/mermaid'

type Props = {
  initialSource: string
  onChange: OnChange
}

export const Editor: VFC<Props> = ({initialSource, onChange}) => {
  const prefersDarkMode = usePrefersDarkMode()

  const beforeEditorMount: BeforeMount = useCallback(monaco => {
    monaco.languages.register({id: 'mermaid'})
    monaco.languages.setMonarchTokensProvider('mermaid', mermaidLanguage)
  }, [])

  return (
    <MonacoEditor
      defaultLanguage="mermaid"
      options={{minimap: {enabled: false}, insertSpaces: false, tabSize: 4}}
      theme={prefersDarkMode ? 'vs-dark' : 'vs-light'}
      defaultValue={initialSource}
      beforeMount={beforeEditorMount}
      onChange={onChange}
    />
  )
}
