import {FC} from 'react'
import {AppHeader} from './AppHeader'

type Props = {
  editorMenu?: boolean
}

export const AppFrame: FC<Props> = ({children, editorMenu}) => {
  return (
    <div className="flex flex-col absolute top-0 right-0 bottom-0 left-0">
      <AppHeader editorMenu={editorMenu} />

      {children}
    </div>
  )
}
