import { forwardRef } from 'react'
import { cn } from '../../utils'

/**
 * Input component with Bootstrap-like API using Tailwind CSS
 * Supports input groups with adornments (icons, text, etc.)
 *
 * @example
 * <Input placeholder="Search..." />
 * <Input hasError placeholder="Invalid input" />
 * <Input startAdornment={<Search size={16} />} />
 * <Input endAdornment={<Check size={16} className="text-[var(--success)]" />} />
 */
const Input = forwardRef(
  (
    {
      hasError = false,
      disabled = false,
      className = '',
      startAdornment = null,
      endAdornment = null,
      type = 'text',
      ...props
    },
    ref
  ) => {
    // Base input styles (matching Bootstrap's .form-control)
    const baseInputStyles = cn(
      'block w-full px-3 py-1.5 text-base',
      'bg-white border border-gray-300 rounded',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]',
      'disabled:bg-gray-100 disabled:cursor-not-allowed',
      {
        'border-[var(--danger)] focus:ring-[var(--danger)] focus:border-[var(--danger)]':
          hasError,
      }
    )

    const inputElement = (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseInputStyles,
          {
            'rounded-l-none': startAdornment,
            'rounded-r-none': endAdornment,
          },
          className
        )}
        {...props}
      />
    )

    // If no adornments, just return the input
    if (!startAdornment && !endAdornment) {
      return inputElement
    }

    // Input group with adornments
    return (
      <div className="flex w-full">
        {startAdornment && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
            {startAdornment}
          </span>
        )}
        {inputElement}
        {endAdornment && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r">
            {endAdornment}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
