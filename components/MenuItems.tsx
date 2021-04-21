import {Menu, Transition} from '@headlessui/react'
import classNames from 'classnames'
import {FC, Fragment} from 'react'

type Props = {
  open: boolean
  full?: boolean
}

export const MenuItems: FC<Props> = ({children, open, full}) => {
  return (
    <Transition
      show={open}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        static
        className={classNames({
          ['menu-items-full']: full,
          ['menu-items']: !full
        })}
      >
        {children}
      </Menu.Items>
    </Transition>
  )
}
