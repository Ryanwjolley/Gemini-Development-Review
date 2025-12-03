import _ from 'lodash'
import { cn } from '../utils'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2 } from 'lucide-react'
import { getFileExt, switchy } from '@shared'
import toast from './Toast'

const mbSizeLimit = 20
const toMb = bytes => bytes / 1000000

const Dropzone = ({
  onDrop: onDropProp,
  disabled: disabledProp,
  skipParse = false,
  multiple = false,
  className = '',
  style = {},
  helpText = '',
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'text/csv': ['.csv'],
  },
  renderHelp = () => (
    <div className="flex items-center gap-2">
      <Upload size={16} /> {helpText}
    </div>
  ),
}) => {
  const [dropping, setDropping] = useState(false)
  const onDrop = useCallback(
    acceptedFiles => {
      const handleOnDrop = async () => {
        setDropping(true)
        if (_.some(acceptedFiles, file => toMb(file.size) > mbSizeLimit)) {
          toast.error(`Error: Max file size is ${mbSizeLimit}MB`)
          setDropping(false)
          return
        }
        const parsedFiles = skipParse
          ? acceptedFiles.map(file => ({ file, data: null }))
          : await Promise.all(
              acceptedFiles.map(async file => {
                const fileExt = getFileExt(file.name)
                const data = await switchy(fileExt, {
                  // csv: () =>
                  //   new Promise((resolve, reject) => {
                  //     const reader = new FileReader()
                  //     reader.onabort = () => reject('File read aborted')
                  //     reader.onerror = () => reject('Error parsing')
                  //     reader.onload = () => {
                  //       const { data } = Papa.parse(reader.result)
                  //       resolve(data)
                  //     }
                  //     reader.readAsText(file)
                  //   }),
                  // xlsx: () => readXlsxFile(file, { dateFormat: 'yyyy-mm-dd' }),
                  // pdf: () => {
                  //   const formData = new FormData()
                  //   formData.append('file', file)
                  //   return api('/parse-pdf-rows', formData, {
                  //     headers: { 'Content-Type': 'multipart/form-data' },
                  //   })
                  // },
                  default: () =>
                    new Promise((resolve, reject) => {
                      // to base64 data url. Thanks - // cute, thanks.  https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
                      const reader = new FileReader()
                      reader.readAsDataURL(file)
                      reader.onload = () => resolve(reader.result)
                      reader.onerror = error => reject(error)
                    }),
                })
                return { file, data }
              })
            )
        await onDropProp(multiple ? parsedFiles : parsedFiles[0])
        setDropping(false)
      }
      handleOnDrop().catch(e => {
        toast.error(`${e}`)
        setDropping(false)
        console.error('Error dropping files', e)
      })
    },
    [onDropProp, multiple, skipParse]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxFiles: 30,
    // FYI, having this 'accept' prop seems to slow down
    // the speed of opening the native file dialog box for whatever reason.
    // if it became annoying enough, could just remove it and do the check
    // for accepted files when onDrop happens
    accept,
  })
  const disabled = disabledProp || dropping || isDragActive
  return (
    <div
      {...getRootProps({
        ...(dropping && { onClick: () => {} }), // there's probably a better way to disable click when uploading, but this works
        className: cn('px-2 flex items-center justify-center', className),
        style: {
          cursor: 'pointer',
          borderStyle: 'dashed',
          outline: disabled ? 'none' : undefined,
          borderColor: disabled ? 'var(--gray-400)' : 'var(--primary)',
          ...style,
        },
      })}
    >
      <input {...getInputProps()} />
      <div
        style={{ color: disabled ? 'var(--gray-400)' : 'var(--primary)' }}
        className="flex items-center justify-center"
      >
        {dropping ? (
          <div className="flex items-center gap-2">
            Uploading <Loader2 size={16} className="animate-spin" />
          </div>
        ) : (
          renderHelp()
        )}
      </div>
    </div>
  )
}

export default Dropzone
