import classnames from 'classnames'
import mermaid from 'mermaid/dist/mermaid'
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  VFC
} from 'react'
import {usePrefersDarkMode} from '../hooks/usePrefersDarkMode'
import {sourceContext, viewerContext} from './context'

const containerID = 'render-container'

const Viewer: VFC = memo(() => {
  const [svg, setSvg] = useState('')
  const {source, error, setError} = useContext(sourceContext)
  const lastValidSource = useRef(source)
  const prefersDarkMode = usePrefersDarkMode()
  const svgRef = useContext(viewerContext)
  const svgWrapperRef = useRef<HTMLDivElement>(null)

  const parseAndRender = useCallback(
    (source: string | null) => {
      if (source) {
        try {
          mermaid.parse(source)
          setError(null)
          lastValidSource.current = source
        } catch (err) {
          setError(err)
          return
        }

        setSvg(mermaid.render('containerID', source))
      } else {
        setSvg('')
      }
    },
    [setError]
  )

  useEffect(() => {
    svgRef.current = svgWrapperRef.current?.querySelector('svg') ?? null
  })

  useEffect(() => {
    mermaid.initialize({theme: prefersDarkMode ? 'dark' : 'default'})
    parseAndRender(source)
  }, [parseAndRender, prefersDarkMode, source])

  useEffect(() => {
    parseAndRender(source)
  }, [parseAndRender, source])

  useLayoutEffect(() => {
    const svgElement = svgWrapperRef.current?.firstChild as HTMLElement
    if (!svgElement) return
    svgElement.removeAttribute('height')
    svgElement.removeAttribute('width')
  })

  const viewerClassName = classnames('border border-4 w-full', {
    'border-red-500': error,
    'border-transparent': !error
  })

  return (
    <div className="flex flex-col">
      <div
        className={viewerClassName}
        id={containerID}
        dangerouslySetInnerHTML={{__html: svg}}
        ref={svgWrapperRef}
      ></div>
      {error && (
        <pre className="p-2 font-semibold text-xs text-red-500">
          <code>{error.str}</code>
        </pre>
      )}
    </div>
  )
})

Viewer.displayName = 'Viewer'

export default Viewer
