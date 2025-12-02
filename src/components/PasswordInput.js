import React from 'react'
import { cn } from '../utils'
import { CheckCircle, Ban } from 'lucide-react'
import Input from './Input'

const PasswordInput = ({
  inputType = 'password',
  placeholder = '',
  disabled = false,
  value,
  setValue,
  isStrong,
  hasEnoughChars,
  hasLower,
  hasUpper,
  hasNumber,
  hasSpecial,
}) => {
  return (
    <>
      <Input
        type={inputType}
        disabled={disabled}
        onChange={e => setValue(e.target.value)}
        value={value}
        hasError={!value || !isStrong}
        placeholder={placeholder}
        endAdornment={
          isStrong ? (
            <CheckCircle size={16} className="text-[var(--success)]" />
          ) : (
            <Ban size={16} className="text-[var(--danger)]" />
          )
        }
      />

      <small className="text-xs text-[var(--danger)] mt-1 block">
        {[
          { text: 'Lowercase letter', bool: hasLower },
          { text: 'Uppercase letter', bool: hasUpper },
          { text: 'Number', bool: hasNumber },
          { text: 'Special character', bool: hasSpecial },
          { text: '6+ characters', bool: hasEnoughChars },
        ].map(({ text, bool }) => (
          <span className="mr-2 whitespace-nowrap flex items-center gap-1" key={text}>
            {bool ? (
              <span className="text-[var(--success)] flex items-center gap-1">
                <CheckCircle size={14} /> {text}
              </span>
            ) : (
              <span className="text-[var(--danger)] flex items-center gap-1">
                <Ban size={14} /> {text}
              </span>
            )}
          </span>
        ))}
      </small>
    </>
  )
}

export default PasswordInput
