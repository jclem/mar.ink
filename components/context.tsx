import {Base64} from 'js-base64'
import {useRouter} from 'next/router'
import {
  createContext,
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react'

export const editorContext = createContext<{
  isEditorShown: boolean
  setIsEditorShown: Dispatch<SetStateAction<boolean>>
}>({
  isEditorShown: true,
  setIsEditorShown: () => null
})

interface IMermaidError {
  str: string
}

export const sourceContext = createContext<{
  source: string | null
  setSource: Dispatch<SetStateAction<string | null>>
  error: IMermaidError | null
  setError: Dispatch<SetStateAction<IMermaidError | null>>
}>({
  source: null,
  setSource: () => null,
  error: null,
  setError: () => null
})

export const SourceContextProvider: FC = ({children}) => {
  const [source, setSource] = useState<string | null>(null)
  const [error, setError] = useState<IMermaidError | null>(null)
  const {
    query: {source: sourceParam}
  } = useRouter()

  useEffect(() => {
    try {
      setSource(
        sourceParam && typeof sourceParam === 'string'
          ? Base64.decode(sourceParam)
          : ''
      )
    } catch (err) {
      console.error(`Error parsing source parameter: ${err}`)
    }
  }, [setSource, sourceParam])

  const sourceContextValue = useMemo(
    () => ({source, setSource, error, setError}),
    [error, source]
  )

  return (
    <sourceContext.Provider value={sourceContextValue}>
      {children}
    </sourceContext.Provider>
  )
}

export const viewerContext = createContext<
  MutableRefObject<SVGGraphicsElement | null>
>({current: null})
