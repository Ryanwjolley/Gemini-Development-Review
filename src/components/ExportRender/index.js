import { useEffect, useState } from 'react'
import { setGlobalState } from '../../globalState'
import { PrintContainer } from '../Print'
import ExportErrorHandler from './ExportErrorHandler'
import Orientation from './Orientation'
import { exportFileTypes } from '@shared'
// import SomeComponent from '../SomeComponent'

const ExportComponents = {
  // SomeComponent
}

const ExportRender = () => {
  const [renderProps, setRenderProps] = useState(null)
  const [readyForPrint, setReadyForPrint] = useState(false)
  window.setRenderProps = setRenderProps
  useEffect(() => {
    if (renderProps) {
      const { globalState } = renderProps
      if (globalState) {
        setGlobalState(globalState)
      }
      setReadyForPrint(true)
    }
  }, [renderProps])
  if (!renderProps || !readyForPrint) return null

  const { exportProps, componentProps } = renderProps
  const { fileType, landscape, component } = exportProps
  const ExportComponent = ExportComponents[component]

  if (!ExportComponent) {
    return <div>Component not found</div>
  }

  if (fileType === exportFileTypes.png) {
    return (
      <div id="png-container">
        <ExportComponent
          exportRender
          {...{ exportProps }}
          {...componentProps}
        />
        {readyForPrint && <div id="export-ready-for-print" />}
      </div>
    )
  }

  return (
    <PrintContainer showFooter={!landscape}>
      <Orientation {...{ landscape }}>
        <ExportComponent
          exportRender
          {...{ exportProps }}
          {...componentProps}
        />
      </Orientation>
      {readyForPrint && <div id="export-ready-for-print" />}
    </PrintContainer>
  )
}

const ExportRenderWrapper = () => (
  <ExportErrorHandler>
    <ExportRender />
  </ExportErrorHandler>
)

export default ExportRenderWrapper
