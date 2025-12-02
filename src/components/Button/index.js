import { forwardRef } from 'react'
import { cn } from '../../utils'

/**
 * Button component with Semantic UI-inspired design using Tailwind CSS
 *
 * @example
 * <Button variant="primary" size="sm" loading>Save</Button>
 * <Button variant="danger" outline>Delete</Button>
 * <Button>Default Button</Button>
 */
const Button = forwardRef(
  (
    {
      variant,
      size = 'md',
      outline = false,
      loading = false,
      disabled = false,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    // Base button styles (Semantic UI style)
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-medium text-center',
      'border rounded',
      'transition-all duration-150',
      'focus:outline-none',
      'cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'cursor-not-allowed': isDisabled,
      }
    )

    // Size styles
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    }

    // Solid variant styles (Semantic UI inspired)
    const solidVariants = {
      primary: cn(
        'bg-[var(--primary)] text-white border-[var(--primary)]',
        'hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)]',
        'active:bg-[var(--primary-active)]',
        'shadow-sm'
      ),
      secondary: cn(
        'bg-[var(--secondary)] text-white border-[var(--secondary)]',
        'hover:bg-[var(--secondary-hover)] hover:border-[var(--secondary-hover)]',
        'active:bg-[var(--secondary-active)]',
        'shadow-sm'
      ),
      success: cn(
        'bg-[var(--success)] text-white border-[var(--success)]',
        'hover:bg-[var(--success-hover)] hover:border-[var(--success-hover)]',
        'active:bg-[var(--success-active)]',
        'shadow-sm'
      ),
      danger: cn(
        'bg-[var(--danger)] text-white border-[var(--danger)]',
        'hover:bg-[var(--danger-hover)] hover:border-[var(--danger-hover)]',
        'active:bg-[var(--danger-active)]',
        'shadow-sm'
      ),
      link: cn(
        'bg-transparent text-[var(--primary)] border-transparent',
        'hover:text-[var(--primary-hover)] hover:underline',
        'disabled:no-underline',
        'shadow-none'
      ),
    }

    // Outline variant styles
    const outlineVariants = {
      primary: cn(
        'bg-transparent text-[var(--primary)] border-[var(--primary)]',
        'hover:bg-[var(--primary)] hover:text-white',
        'active:bg-[var(--primary-hover)] active:border-[var(--primary-hover)]'
      ),
      secondary: cn(
        'bg-transparent text-[var(--secondary)] border-[var(--secondary)]',
        'hover:bg-[var(--secondary)] hover:text-white',
        'active:bg-[var(--secondary-hover)] active:border-[var(--secondary-hover)]'
      ),
      success: cn(
        'bg-transparent text-[var(--success)] border-[var(--success)]',
        'hover:bg-[var(--success)] hover:text-white',
        'active:bg-[var(--success-hover)] active:border-[var(--success-hover)]'
      ),
      danger: cn(
        'bg-transparent text-[var(--danger)] border-[var(--danger)]',
        'hover:bg-[var(--danger)] hover:text-white',
        'active:bg-[var(--danger-hover)] active:border-[var(--danger-hover)]'
      ),
    }

    // Default base style (when no variant specified)
    const defaultStyle = cn(
      'bg-gray-200 text-gray-800 border-gray-300',
      'hover:bg-gray-300 hover:border-gray-400',
      'active:bg-gray-400',
      'shadow-sm'
    )

    const variantStyles = variant
      ? outline
        ? outlineVariants[variant]
        : solidVariants[variant]
      : defaultStyle

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(baseStyles, sizeStyles[size], variantStyles, className)}
        {...props}
      >
        {children}
        {loading && (
          <svg
            className="ml-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
