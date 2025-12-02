// note - need to use event.stopPropagation() in the onClick or popover won't ever open cuz of handleOutsideClick() below
import { useState, useRef, useEffect } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
} from '@floating-ui/react'
import { X } from 'lucide-react'

const Popover = ({
  title,
  containerClassName = 'p-3',
  bodyContainerClassName = 'border border-gray-200 rounded-xl bg-white shadow-lg/20',
  bodyContainerStyle = {},
  body,
  trigger,
  width = '600px',
  onClose = () => {},
  placement = 'bottom',
  // optionally use ids to prevent a bunch of popovers in a group to show over the top of each other
  popoverId,
  activePopoverId,
  closeOnOutsideClick = true,
  onOutsideClick = () => {},
  align,
}) => {
  const [isOpen, setPopoverOpen] = useState(false)
  const closePopover = () => {
    setPopoverOpen(false)
    onClose()
  }
  const onCloseRef = useRef()
  onCloseRef.current = onClose
  const onOutsideClickRef = useRef()
  onOutsideClickRef.current = onOutsideClick

  // Map rc-tooltip placement to Floating UI placement
  const getFloatingPlacement = () => {
    if (align?.points) {
      // Handle align prop like { points: ['br', 'tr'] }
      const [anchorPoint, floatingPoint] = align.points
      // br-tr means bottom-right of anchor aligns with top-right of floating
      if (anchorPoint === 'br' && floatingPoint === 'tr') return 'bottom-end'
    }
    // Map common placements
    const placementMap = {
      bottom: 'bottom',
      top: 'top',
      left: 'left',
      right: 'right',
      bottomLeft: 'bottom-start',
      bottomRight: 'bottom-end',
      topLeft: 'top-start',
      topRight: 'top-end',
    }
    return placementMap[placement] || 'bottom'
  }

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: open => {
      setPopoverOpen(open)
      if (!open) {
        onClose()
      }
    },
    placement: getFloatingPlacement(),
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context, { enabled: false }) // We handle clicks manually
  const dismiss = useDismiss(context, {
    enabled: closeOnOutsideClick,
    outsidePress: e => {
      if (closeOnOutsideClick) {
        onOutsideClickRef.current()
      }
      return closeOnOutsideClick
    },
  })
  const role = useRole(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ])

  useEffect(() => {
    if (popoverId !== activePopoverId) {
      setPopoverOpen(false)
    }
  }, [popoverId, activePopoverId])

  return (
    <>
      {trigger({
        setPopoverOpen,
        isOpen,
        setTriggerElement: refs.setReference,
        popoverId,
        ref: refs.setReference,
        ...getReferenceProps(),
      })}
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            style={{ ...floatingStyles, zIndex: 2000 }}
          >
            <div
              className={bodyContainerClassName}
              style={{
                width,
                maxWidth: '95vw',
                ...bodyContainerStyle,
              }}
              onClick={e => e.stopPropagation()}
            >
              {title && (
                <h5 className="border-b border-gray-200 flex items-center p-3 font-semibold">
                  {title}
                  <button
                    type="button"
                    className="ml-auto outline-0 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={closePopover}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </h5>
              )}
              <div className={containerClassName}>{body(closePopover)}</div>
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

export default Popover
