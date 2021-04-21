import {Menu} from '@headlessui/react'
import {
  ChevronDownIcon,
  CodeIcon,
  EyeIcon,
  LinkIcon,
  PencilIcon,
  PhotographIcon
} from '@heroicons/react/outline'
import classNames from 'classnames'
import {Base64} from 'js-base64'
import Link from 'next/link'
import React, {useCallback, useContext, VFC} from 'react'
import {editorContext, sourceContext, viewerContext} from './context'
import {MenuItems} from './MenuItems'

type Props = {
  mini?: boolean
}

export const EditorMenu: VFC<Props> = ({mini}) => {
  const {isEditorShown, setIsEditorShown} = useContext(editorContext)
  const {source, error} = useContext(sourceContext)
  const svgRef = useContext(viewerContext)
  const isInvalidState = Boolean(!source || error)

  const downloadImage = useCallback(
    (format: 'png' | 'jpg' | 'svg') => {
      const svg = svgRef.current
      if (!svg) return

      // https://stackoverflow.com/a/50857516

      const data = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'})

      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = e => {
        const url = e.target?.result ?? null
        if (url) image.src = url.toString()
      }

      const canvas = document.createElement('canvas')
      const box = svg.getBBox()
      canvas.width = box.width
      canvas.height = box.height

      canvas.width *= devicePixelRatio
      canvas.height *= devicePixelRatio

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No context created')
      ctx.imageSmoothingEnabled = false
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const image = new Image()

      image.onload = function () {
        ctx.drawImage(image, 0, 0, box.width, box.height)
        const anchor = document.createElement('a')

        const dateString = new Date()
          .toISOString()
          .replaceAll(':', '-')
          .replace(/\.\d+/, '')

        const mimeType = {
          jpg: 'image/jpeg',
          png: 'image/png',
          svg: 'image/svg+xml'
        }[format]

        anchor.download = `mermaid-diagram-${dateString}.${format}`
        anchor.href = format === 'svg' ? image.src : canvas.toDataURL(mimeType)
        anchor.click()
      }
    },
    [svgRef]
  )

  const copyLink = useCallback(
    (markdown = false) => {
      if (!source) return
      const encodedSource = Base64.encodeURI(source)
      const url = getAPIURL(encodedSource)
      let text = url
      if (markdown) text = `[![](${url})](${url})`
      navigator.clipboard.writeText(text)
    },
    [source]
  )

  const copyHTML = useCallback(() => {
    const svg = svgRef.current
    if (!svg || !source) return

    const {width, height} = svg.getBoundingClientRect()
    const encodedSource = Base64.encodeURI(source)
    const url = getAPIURL(
      `${encodedSource}?deviceScaleFactor=${devicePixelRatio}`
    )
    const tagWidth = Math.round(width)
    const tagHeight = Math.round(height)
    const tag = `<img src="${url}" width="${tagWidth}px" height="${tagHeight}px" />`
    navigator.clipboard.writeText(tag)
  }, [source, svgRef])

  if (mini) {
    return (
      <>
        <div className="px-1 py-1">
          <Menu.Item>
            {({active}) => (
              <button
                className={classNames('menu-item-button group', {
                  active
                })}
                onClick={() => setIsEditorShown(isShown => !isShown)}
              >
                <PencilIcon aria-hidden="true" />
                {isEditorShown ? 'Hide Editor' : 'Show Editor'}
              </button>
            )}
          </Menu.Item>
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <Link href={`/view/${Base64.encodeURI(source ?? '')}`}>
                <a
                  className={classNames('menu-item-button group', {
                    active,
                    disabled
                  })}
                  onClick={e => {
                    if (isInvalidState) e.preventDefault()
                  }}
                >
                  <EyeIcon aria-hidden="true" />
                  View Image Only
                </a>
              </Link>
            )}
          </Menu.Item>
        </div>
        <div className="px-1 py-1">
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => downloadImage('png')}
              >
                <PhotographIcon aria-hidden="true" />
                Download PNG
              </button>
            )}
          </Menu.Item>
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => downloadImage('jpg')}
              >
                <PhotographIcon aria-hidden="true" />
                Download JPEG
              </button>
            )}
          </Menu.Item>
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => downloadImage('svg')}
              >
                <PhotographIcon aria-hidden="true" />
                Download SVG
              </button>
            )}
          </Menu.Item>
        </div>
        <div className="px-1 py-1">
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => copyLink()}
              >
                <LinkIcon aria-hidden="true" />
                Copy Link to Image
              </button>
            )}
          </Menu.Item>
        </div>
        <div className="px-1 py-1">
          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => copyLink(true)}
              >
                <CodeIcon aria-hidden="true" />
                Copy Markdown Link to Image
              </button>
            )}
          </Menu.Item>

          <Menu.Item disabled={isInvalidState}>
            {({active, disabled}) => (
              <button
                disabled={disabled}
                className={classNames('menu-item-button group', {
                  active,
                  disabled
                })}
                onClick={() => copyHTML()}
              >
                <CodeIcon aria-hidden="true" />
                Copy HTML Image Tag
              </button>
            )}
          </Menu.Item>
        </div>
      </>
    )
  }

  return (
    <>
      <Menu as="div" className="relative inline-block text-left mr-2">
        {({open}) => (
          <>
            <Menu.Button className={classNames('nav-button', {open})}>
              <span>View</span>
              <ChevronDownIcon aria-hidden="true" />
            </Menu.Button>

            <MenuItems open={open}>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({active}) => (
                    <button
                      className={classNames('menu-item-button group', {
                        active
                      })}
                      onClick={() => setIsEditorShown(isShown => !isShown)}
                    >
                      <PencilIcon aria-hidden="true" />
                      {isEditorShown ? 'Hide Editor' : 'Show Editor'}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <Link href={`/view/${Base64.encodeURI(source ?? '')}`}>
                      <a
                        className={classNames('menu-item-button group', {
                          active,
                          disabled
                        })}
                        onClick={e => {
                          if (isInvalidState) e.preventDefault()
                        }}
                      >
                        <EyeIcon aria-hidden="true" />
                        View Image Only
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </MenuItems>
          </>
        )}
      </Menu>

      <Menu as="div" className="relative inline-block text-left mr-2">
        {({open}) => (
          <>
            <Menu.Button className={classNames('nav-button', {open})}>
              <span>Download</span>
              <ChevronDownIcon aria-hidden="true" />
            </Menu.Button>

            <MenuItems open={open}>
              <div className="px-1 py-1">
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => downloadImage('png')}
                    >
                      <PhotographIcon aria-hidden="true" />
                      PNG
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => downloadImage('jpg')}
                    >
                      <PhotographIcon aria-hidden="true" />
                      JPEG
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => downloadImage('svg')}
                    >
                      <PhotographIcon aria-hidden="true" />
                      SVG
                    </button>
                  )}
                </Menu.Item>
              </div>
            </MenuItems>
          </>
        )}
      </Menu>

      <Menu as="div" className="relative inline-block text-left mr-2">
        {({open}) => (
          <>
            <Menu.Button className={classNames('nav-button', {open})}>
              <span>Copy</span>
              <ChevronDownIcon aria-hidden="true" />
            </Menu.Button>

            <MenuItems open={open}>
              <div className="px-1 py-1">
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => copyLink()}
                    >
                      <LinkIcon aria-hidden="true" />
                      Link to Image
                    </button>
                  )}
                </Menu.Item>
              </div>
              <div className="px-1 py-1">
                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => copyLink(true)}
                    >
                      <CodeIcon aria-hidden="true" />
                      Markdown Link to Image
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item disabled={isInvalidState}>
                  {({active, disabled}) => (
                    <button
                      disabled={disabled}
                      className={classNames('menu-item-button group', {
                        active,
                        disabled
                      })}
                      onClick={() => copyHTML()}
                    >
                      <CodeIcon aria-hidden="true" />
                      HTML Image Tag
                    </button>
                  )}
                </Menu.Item>
              </div>
            </MenuItems>
          </>
        )}
      </Menu>
    </>
  )
}

const getAPIURL = (path: string) => {
  return `${location.protocol}//${location.host}/api/image/${path}`
}
