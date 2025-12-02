import { cn } from '../utils'
import { forwardRef } from 'react'

const IconBtn = forwardRef(
  (
    { className = 'text-primary', children, onClick = () => {}, ...props },
    ref
  ) => {
    return (
      <span
        ref={ref}
        role="button"
        tabIndex={-1}
        className={cn('cursor-pointer', className)}
        onKeyDown={e => e.key === 'Enter' && onClick()}
        onClick={onClick}
        {...props}
      >
        {children}
      </span>
    )
  }
)

export default IconBtn
