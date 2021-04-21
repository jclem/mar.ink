import {OnChange} from '@monaco-editor/react'
import {Base64} from 'js-base64'
import debounce from 'lodash/debounce'
import {NextPage} from 'next'
import dynamic from 'next/dynamic'
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  VFC
} from 'react'
import {AppFrame} from '../components/AppFrame'
import {
  editorContext,
  sourceContext,
  SourceContextProvider,
  viewerContext
} from '../components/context'
import {Editor} from '../components/Editor'

const Viewer = dynamic(() => import('../components/Viewer'), {ssr: false})

const IndexPage: NextPage = () => {
  const [isEditorShown, setIsEditorShown] = useState(true)
  const svgRef = useRef<SVGGraphicsElement | null>(null)

  const editorContextValue = useMemo(
    () => ({isEditorShown, setIsEditorShown}),
    [isEditorShown]
  )

  return (
    <editorContext.Provider value={editorContextValue}>
      <SourceContextProvider>
        <viewerContext.Provider value={svgRef}>
          <IndexPageInternal />
        </viewerContext.Provider>
      </SourceContextProvider>
    </editorContext.Provider>
  )
}

const IndexPageInternal: VFC = () => {
  const {isEditorShown} = useContext(editorContext)
  const {source, setSource} = useContext(sourceContext)

  const updateHistory = useCallback((source: string) => {
    const sourceParam = Base64.encodeURI(source)

    const url = sourceParam
      ? `?source=${sourceParam}`
      : window.location.pathname
    history.replaceState(null, '', url)
  }, [])

  const debouncedSetSource = useMemo(() => debounce(setSource, 250), [
    setSource
  ])

  const onEditorChange: OnChange = useCallback(
    source => {
      debouncedSetSource(source ?? '')
      if (source != null) updateHistory(source)
    },
    [debouncedSetSource, updateHistory]
  )

  return (
    <AppFrame editorMenu={true}>
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {isEditorShown && source != null && (
          <div className="min-h-[8rem] h-[40%] max-h-[16rem] flex-shrink-0 border-b border-gray-100 dark:border-gray-800 lg:min-h-[unset] lg:h-auto lg:max-h-[unset] lg:min-w-[28rem] lg:w-[40%] lg:max-w-[36rem] lg:border-b-0 lg:border-r">
            <Editor initialSource={source} onChange={onEditorChange} />
          </div>
        )}

        <div className="flex-grow overflow-scroll">
          <Viewer />
        </div>
      </main>
    </AppFrame>
  )
}

export default IndexPage
