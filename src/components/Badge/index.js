import { forwardRef } from 'react'
import { cn } from '../../utils'

/**
 * Badge component with Semantic UI-inspired design using Tailwind CSS
 *
 * @example
 * <Badge variant="primary">5</Badge>
 * <Badge variant="success" pill>New</Badge>
 * <Badge>Default Badge</Badge>
 */
const Badge = forwardRef(
  (
    {
      variant,
      pill = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Base badge styles
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'font-semibold text-center',
      'px-2 py-0.5',
      'text-xs leading-tight',
      {
        'rounded': !pill,
        'rounded-full': pill, // badge-pill
      }
    )

    // Variant styles matching Button component colors
    const variantStyles = {
      primary: 'bg-[var(--primary)] text-white',
      secondary: 'bg-[var(--secondary)] text-white',
      success: 'bg-[var(--success)] text-white',
      danger: 'bg-[var(--danger)] text-white',
    }

    // Default style (when no variant specified)
    const defaultStyle = 'bg-gray-600 text-white'

    const colorStyles = variant ? variantStyles[variant] : defaultStyle

    return (
      <span
        ref={ref}
        className={cn(baseStyles, colorStyles, className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
