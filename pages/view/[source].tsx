import {NextPage} from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import {SourceContextProvider} from '../../components/context'

const Viewer = dynamic(() => import('../../components/Viewer'), {ssr: false})

const ViewPage: NextPage = () => {
  return (
    <SourceContextProvider>
      <Viewer />
    </SourceContextProvider>
  )
}

export default ViewPage
