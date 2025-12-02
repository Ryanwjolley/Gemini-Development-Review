import _ from 'lodash'
import { cn } from '@/lib/utils'
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({
  onClose = _.noop,
  onMount = _.noop,
  onUpdate = _.noop,
  isOpen = false,
  trigger = () => null, // can be a function: openModal => <Button onClick={openModal}>Click</Button>, or a React element: <Button>Click</Button>
  dontShowCloseBtn = false,
  maxWidth = '700px',
  minContentHeight = '0px',
  darkerBackground = false,
  containerStyle = {},
  bodyClassName = '',
  bodyStyle = {},
  title,
  body,
  footer,
  renderTitle = title => <h5 className="text-lg font-medium">{title}</h5>,
}) {
  const [show, setShow] = useState(false)
  const portalDivRef = useRef(null)
  const portalDivBackdropRef = useRef(null)

  // Create portal divs on mount
  useEffect(() => {
    portalDivRef.current = document.createElement('div')
    portalDivBackdropRef.current = document.createElement('div')

    document.body.appendChild(portalDivRef.current)
    document.body.appendChild(portalDivBackdropRef.current)

    // Cleanup on unmount - with defensive checks
    return () => {
      document.body.removeAttribute('style')

      if (portalDivRef.current?.parentNode === document.body) {
        document.body.removeChild(portalDivRef.current)
      }

      if (portalDivBackdropRef.current?.parentNode === document.body) {
        document.body.removeChild(portalDivBackdropRef.current)
      }
    }
  }, [])

  // Handle isOpen prop changes
  useEffect(() => {
    if (isOpen) {
      openModal()
    }
  }, [isOpen])

  // Call onMount on first mount
  useEffect(() => {
    onMount()
  }, [])

  // Call onUpdate when show changes
  useEffect(() => {
    onUpdate({ show })
  }, [show, onUpdate])

  const openModal = () => {
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    setShow(true)
  }

  const closeModal = () => {
    document.body.removeAttribute('style')
    setShow(false)
  }

  const renderTrigger = openModal => {
    if (_.isFunction(trigger)) {
      return trigger(openModal)
    }
    if (isValidElement(trigger)) {
      return cloneElement(trigger, {
        onClick: e => {
          trigger.props.onClick?.(e)
          openModal()
        },
      })
    }
    return null
  }

  if (!show) {
    return renderTrigger(openModal)
  }

  return (
    <Fragment>
      {renderTrigger(openModal)}
      {portalDivRef.current &&
        createPortal(
          <div
            className="fixed inset-0 inline-block z-[1100]"
            role="dialog"
            style={{
              overflow: 'auto',
              ...(darkerBackground && {
                backgroundColor: 'rgba(0,0,0,0.3)',
              }),
              ...containerStyle,
            }}
          >
            <div
              className="relative mx-auto my-12 w-full"
              role="document"
              style={{ maxWidth }}
            >
              <div
                className="relative bg-white rounded-xl shadow-xl"
                style={{ minHeight: minContentHeight }}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  {renderTitle(title)}
                  {!dontShowCloseBtn && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => {
                        closeModal()
                        onClose()
                      }}
                      aria-label="Close"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
                <div className={cn('p-4', bodyClassName)} style={bodyStyle}>
                  {_.isFunction(body) ? body(closeModal) : body}
                </div>
                {footer && (
                  <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                    {_.isFunction(footer) ? footer(closeModal) : footer}
                  </div>
                )}
              </div>
            </div>
          </div>,
          portalDivRef.current
        )}
      {portalDivBackdropRef.current &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-[1050] transition-opacity"></div>,
          portalDivBackdropRef.current
        )}
    </Fragment>
  )
}
