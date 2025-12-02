import { useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Tooltip from './Tooltip'
import Button from './Button'
import toast from './Toast'

// thanks https://stackoverflow.com/a/52605237/4043955
const copyToClipboard = (text, onDone = () => {}, onError = onDone) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(onDone, onError)
  } else if (window.clipboardData) {
    // Internet Explorer
    try {
      window.clipboardData.setData('Text', text)
      onDone()
    } catch (e) {
      onError(e)
    }
  }
}

// Helper function to parse Bootstrap className into Button props
// This allows backward compatibility with existing Bootstrap class usage
const parseBootstrapClassName = (className = '') => {
  const classes = className.split(' ')
  let variant = 'primary'
  let size = 'md'
  let outline = false
  let extraClasses = []

  classes.forEach(cls => {
    if (cls.startsWith('btn-outline-')) {
      outline = true
      variant = cls.replace('btn-outline-', '')
    } else if (cls.startsWith('btn-')) {
      const btnVariant = cls.replace('btn-', '')
      if (btnVariant === 'sm') size = 'sm'
      else if (btnVariant === 'lg') size = 'lg'
      else if (!['btn'].includes(btnVariant)) {
        variant = btnVariant
      }
    } else if (cls !== 'btn') {
      extraClasses.push(cls)
    }
  })

  return { variant, size, outline, className: extraClasses.join(' ') }
}

const CopyToClipboardBtn = ({
  className = 'btn btn-primary',
  variant: variantProp,
  size: sizeProp,
  outline: outlineProp,
  children = <Copy size={16} />,
  text = '',
  tooltipTitle = '',
  tooltipPlacement = 'bottomRight',
  getText = () => Promise.resolve(text),
  successMsg = (
    <span className="flex items-center gap-2">
      Copy successful <Check size={16} />
    </span>
  ),
}) => {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef()

  // Parse Bootstrap className for backward compatibility
  // If variant/size/outline props are provided directly, they take precedence
  const parsed = parseBootstrapClassName(className)
  const variant = variantProp || parsed.variant
  const size = sizeProp || parsed.size
  const outline = outlineProp !== undefined ? outlineProp : parsed.outline

  useEffect(() => {
    if (copied) {
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2500)
    }
    return () => {
      window.clearTimeout(timerRef.current)
    }
  }, [copied])

  return (
    <Tooltip
      visible={visible || copied}
      onVisibleChange={bool => setVisible(bool)}
      title={(copied && successMsg) || tooltipTitle}
      placement={tooltipPlacement}
    >
      <Button
        variant={variant}
        size={size}
        outline={outline}
        className={parsed.className}
        style={{ opacity: copied ? 0.5 : 1 }}
        disabled={loading}
        onClick={async () => {
          if (!copied && !loading) {
            setLoading(true)
            try {
              const text = await getText()
              copyToClipboard(text, () => setCopied(true))
            } catch (error) {
              console.error('Error getting text for clipboard:', error)
              toast.error('Failed to get text for clipboard')
            } finally {
              setLoading(false)
            }
          }
        }}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export default CopyToClipboardBtn
