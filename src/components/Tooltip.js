import { forwardRef, useState, cloneElement, useRef } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingArrow,
} from '@floating-ui/react'
import { cn } from '@/lib/utils'

const Tooltip = forwardRef(
  (
    {
      title,
      ignoreDisabled = true,
      placement = 'bottom',
      overlayClassName,
      children,
      visible: controlledVisible,
      onVisibleChange,
      mouseEnterDelay = 0,
    },
    ref
  ) => {
    // If no title or (ignoreDisabled is true and child is disabled), just return child
    if (!title || (ignoreDisabled && children.props.disabled)) {
      return children
    }

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const arrowRef = useRef(null)

    // Use controlled or uncontrolled state
    const isControlled = controlledVisible !== undefined
    const isOpen = isControlled ? controlledVisible : uncontrolledOpen

    const setIsOpen = open => {
      if (!isControlled) {
        setUncontrolledOpen(open)
      }
      if (onVisibleChange) {
        onVisibleChange(open)
      }
    }

    // Map placement to Floating UI's placement
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

    const floatingPlacement = placementMap[placement] || 'bottom'

    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: floatingPlacement,
      middleware: [
        offset(8),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowRef }),
      ],
      whileElementsMounted: autoUpdate,
    })

    // Handle delay - convert seconds to milliseconds
    const hover = useHover(context, {
      move: false,
      delay: mouseEnterDelay * 1000,
    })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([
      hover,
      focus,
      dismiss,
      role,
    ])

    // Merge refs
    const childRef = node => {
      refs.setReference(node)
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      // Also handle child's ref if it exists
      const { ref: childRefProp } = children
      if (typeof childRefProp === 'function') {
        childRefProp(node)
      } else if (childRefProp) {
        childRefProp.current = node
      }
    }

    return (
      <>
        {cloneElement(
          children,
          getReferenceProps({ ...children.props, ref: childRef })
        )}
        {isOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={cn(
                'bg-gray-900 text-white px-3 py-1.5 rounded text-sm max-w-[250px] break-words',
                overlayClassName
              )}
              {...getFloatingProps()}
            >
              {title}
              <FloatingArrow ref={arrowRef} context={context} fill="#1f2937" />
            </div>
          </FloatingPortal>
        )}
      </>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export default Tooltip
