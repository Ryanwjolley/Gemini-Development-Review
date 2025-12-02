import _ from 'lodash'
import { useState } from 'react'
import { saveAs } from 'file-saver'
import { Download } from 'lucide-react'
import Tooltip from '../Tooltip'
import Button from '../Button'
import toast from '../Toast'
import { csvify } from '@shared/shared'

const DownloadBtn = ({
  fileExport,
  overflowSpaceFix,
  totalRowData,
  renderTotalRowCellExport,
  data,
  columns,
  tooltipPlacement = 'left',
}) => {
  const [exporting, setExporting] = useState(false)
  const customButtonStyle =
    typeof fileExport === 'object' ? fileExport.buttonStyle : {}

  return (
    <Tooltip title="Export to CSV" placement={tooltipPlacement}>
      <Button
        variant="link"
        disabled={exporting}
        style={{
          position: 'absolute',
          right: '5px',
          top: `${overflowSpaceFix + 3}px`,
          transform: 'translateY(-100%)',
          padding: 0,
          zIndex: 101,
          ...customButtonStyle,
        }}
        onClick={() => {
          setExporting(true)

          try {
            const headers = []
            const totalRow = totalRowData.reduce((acc, val, index) => {
              if (columns[index].visible) {
                acc.push(renderTotalRowCellExport(val))
              }
              return acc
            }, [])
            const rows = _.isEmpty(totalRow) ? [] : [totalRow]

            data.forEach((record, rowIndex) => {
              const rowData = []
              columns.forEach(
                ({ header, renderExport, dontExport }, colIndex) => {
                  if (dontExport) return
                  if (rowIndex === 0) {
                    headers.push(header)
                  }
                  const value = renderExport(record, rowIndex, colIndex)

                  rowData.push(value)
                }
              )
              rows.push(rowData)
            })
            const blob = new Blob([csvify([headers].concat(rows))], {
              type: 'text/csv;charset=utf-8',
            })
            saveAs(blob, fileExport.filename())
          } catch (e) {
            toast.error(`Error exporting data: ${e}`)
          }
          setExporting(false)
        }}
      >
        <Download size={16} />
      </Button>
    </Tooltip>
  )
}

export default DownloadBtn
