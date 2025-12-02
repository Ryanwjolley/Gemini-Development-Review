import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { cn } from '../utils'

const updateHeight = el => {
  el.style.height = 'inherit'
  el.style.height = `${el.scrollHeight}px`
}

/**
 * TextArea component with auto-resize and Bootstrap-like API using Tailwind CSS
 * Matches the validation pattern from Input, SelectSimple and Datepicker (hasError prop)
 *
 * @example
 * <TextArea value={description} onChange={setDescription} hasError={!valid} />
 * <TextArea rows={3} placeholder="Enter notes..." />
 */
const TextArea = forwardRef(
  (
    {
      onChange,
      style,
      hasError = false,
      size = 'md',
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const innerRef = useRef()
    useImperativeHandle(ref, () => innerRef.current) // thanks: https://stackoverflow.com/questions/68162617/whats-the-correct-way-to-use-useref-and-forwardref-together
    useEffect(() => {
      // when using within a popover it didn't resize it at all,
      // but putting it in a setTimeout helped it
      setTimeout(() => updateHeight(innerRef.current))
    }, [])

    // Base textarea styles (matching Input/form-control)
    const baseStyles = cn(
      'block w-full',
      'font-normal text-base text-gray-900',
      'bg-white bg-clip-padding',
      'border rounded',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-1',
      'disabled:bg-gray-100 disabled:opacity-100 disabled:cursor-not-allowed',
      {
        // Error state
        'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]': hasError,
        // Normal state
        'border-gray-400 focus:border-[var(--primary)] focus:ring-[var(--primary)]': !hasError,
      }
    )

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    }

    // removes resize handle and grows on its own. good tips here: https://stackoverflow.com/questions/39401504/javascript-react-dynamic-height-textarea-stop-at-a-max
    return (
      <textarea
        rows={1}
        ref={innerRef}
        disabled={disabled}
        className={cn(baseStyles, sizeStyles[size], className)}
        style={{
          resize: 'none',
          overflow: 'hidden',
          minHeight: '38px',
          ...style,
        }}
        onChange={e => {
          updateHeight(e.target)
          onChange(e)
        }}
        {...props}
      />
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
