import { cn } from '../../utils'
import './ToggleSwitch.scss'

const ToggleSwitch = ({ checked, onChange, className = 'mt-1', disabled }) => {
  return (
    <label className={`switch ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
      />

      <span
        className={cn('slider round', { 'bg-success': checked, disabled })}
      />
    </label>
  )
}

export default ToggleSwitch
