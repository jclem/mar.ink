import {Menu} from '@headlessui/react'
import {MenuIcon} from '@heroicons/react/outline'
import classNames from 'classnames'
import Link from 'next/link'
import React, {FC} from 'react'
import {EditorMenu} from './EditorMenu'
import {GlobalNavigation} from './GlobalNavigation'
import {MenuItems} from './MenuItems'
import {Sea} from './Sea'

type Props = {
  editorMenu?: boolean
}

export const AppHeader: FC<Props> = ({editorMenu}) => {
  return (
    <header className="flex justify-between items-center p-4 flex-shrink-0 px-4 border-b-2 border-gray-100 dark:border-gray-800">
      <Link href="/">
        <a className="flex items-center">
          <Sea className="w-8 h-8 mr-2" aria-hidden="true" />
          <h1 className="tracking-tight font-semibold">mar.ink</h1>
        </a>
      </Link>

      <div className="sm:hidden">
        <Menu as="div" className="inline-block text-left mr-2">
          {({open}) => (
            <>
              <Menu.Button className={classNames({open})}>
                <MenuIcon className="w-4 h-4 text-gray-600" />
              </Menu.Button>

              <MenuItems open={open} full={true}>
                {editorMenu && <EditorMenu mini={true} />}
                <GlobalNavigation mini={true} />
              </MenuItems>
            </>
          )}
        </Menu>
      </div>

      <div className="hidden sm:inline-block">
        {editorMenu && <EditorMenu />}

        <GlobalNavigation />
      </div>
    </header>
  )
}
