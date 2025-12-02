import { useRef, useState } from 'react'
import { cn } from '../../utils'
import { Printer, Loader2 } from 'lucide-react'
import Tooltip from '../Tooltip'
import Print from './Print'
import Button from '../Button'

// use like this:
/* 
  <PrintBtn
    documentTitle="Some doc title"
    renderPrintContent={() => <div>Whatever</div>}
  /> 
*/

const PrintBtn = ({
  className = '',
  variant = 'primary',
  documentTitle = undefined,
  tooltipTitle = 'Print',
  renderPrintContent = () => <div>OK</div>,
}) => {
  const [printing, setPrinting] = useState(false)
  const [show, setShow] = useState(false)
  const printArea = useRef()

  return (
    <>
      <Print
        removeAfterPrint
        onBeforePrint={() => setPrinting(true)}
        onAfterPrint={() => {
          setPrinting(false)
          setShow(false)
        }}
        onBeforeGetContent={async () => {
          setPrinting(true)
          await new Promise(setTimeout) // hack to help make sure button is disabled and looks like something is happening since page could feel unresponsive for a large print/pdf
          setShow(true)
          await new Promise(setTimeout) // hack to help make sure rendering is done before trying to print
        }}
        documentTitle={documentTitle}
        trigger={() => (
          <Tooltip title={tooltipTitle} mouseEnterDelay={0.7}>
            <Button variant={variant} className={className} disabled={printing}>
              {printing ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
            </Button>
          </Tooltip>
        )}
        content={() => printArea.current}
      />
      {show && (
        // render off screen just while printing
        <div style={{ position: 'fixed', left: '10000px', width: '100vw' }}>
          <div ref={printArea}>{renderPrintContent()}</div>
        </div>
      )}
    </>
  )
}

export default PrintBtn
