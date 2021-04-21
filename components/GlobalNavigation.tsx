import {Menu} from '@headlessui/react'
import {PencilAltIcon, QuestionMarkCircleIcon} from '@heroicons/react/outline'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {VFC} from 'react'

type Props = {
  mini?: boolean
}

export const GlobalNavigation: VFC<Props> = ({mini}) => {
  const {pathname} = useRouter()
  const showDrawDiagram = pathname !== '/'

  if (mini) {
    return (
      <div className="px-1 py-1">
        {showDrawDiagram && (
          <Menu.Item>
            {() => (
              <Link href="/">
                <a className="menu-item-button group">
                  <PencilAltIcon aria-hidden="true" />
                  <span>New Diagram</span>
                </a>
              </Link>
            )}
          </Menu.Item>
        )}
        <Menu.Item>
          {() => (
            <Link href="/about">
              <a className="menu-item-button group">
                <QuestionMarkCircleIcon aria-hidden="true" />
                <span>About</span>
              </a>
            </Link>
          )}
        </Menu.Item>
      </div>
    )
  }
  return (
    <>
      {showDrawDiagram && (
        <div className="inline-block mr-2">
          <Link href="/">
            <a className="nav-button">
              <span>New Diagram</span>
              <PencilAltIcon aria-hidden="true" />
            </a>
          </Link>
        </div>
      )}
      <div className="inline-block">
        <Link href="/about">
          <a className="nav-button">
            <span>About</span>
            <QuestionMarkCircleIcon aria-hidden="true" />
          </a>
        </Link>
      </div>
    </>
  )
}
