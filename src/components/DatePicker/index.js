import { cn } from '../../utils'
import { forwardRef, useRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { createPortal } from 'react-dom'
import './DatePicker.scss'

const BodyPortal = ({ children }) => createPortal(children, document.body)

const CustomTimeInput = ({ value, onChange }) => (
  <input
    type="time"
    className="block w-full px-3 py-2 text-base text-gray-900 bg-white border border-gray-400 rounded focus:outline-none focus:ring-1 focus:border-[var(--primary)] focus:ring-[var(--primary)]"
    value={value}
    onChange={e => onChange(e.target.value)}
    onClick={e => e.target?.focus()}
  />
)

const DatePicker = forwardRef(
  (
    {
      date,
      className = 'block w-full px-3 py-2 text-base text-gray-900 bg-white border rounded focus:outline-none focus:ring-1',
      hasError = false,
      renderInPortal = false,
      onChange,
      showTimeInput = false,
      customTimeInput = null,
      isClearable,
      disabled,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef()
    return (
      <ReactDatePicker
        ref={r => {
          if (ref) {
            ref.current = r
          }
          innerRef.current = r
        }}
        onKeyDown={e => {
          if (e.key === 'Tab') {
            innerRef.current.setOpen(false)
          }
        }}
        className={cn(className, {
          'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]': hasError,
          'border-gray-400 focus:border-[var(--primary)] focus:ring-[var(--primary)]':
            !hasError,
        })}
        {...(renderInPortal && { popperContainer: BodyPortal })}
        selected={date ? new Date(date) : undefined}
        onChange={onChange}
        showTimeInput={showTimeInput}
        customTimeInput={
          !showTimeInput ? null : customTimeInput || <CustomTimeInput />
        }
        isClearable={!disabled && isClearable}
        disabled={disabled}
        {...props}
      />
    )
  }
)

export default DatePicker
