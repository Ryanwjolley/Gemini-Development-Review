import { useWindowDimensions, cn } from '../utils'
import { SelectSimple } from './Select'

const PageTabs = ({
  containerClassName = 'mt-2 mb-4',
  options, // [{label:'', value: ''}]
  value,
  onChange,
  showSelectForSmallScreen = true,
}) => {
  const { smallScreen } = useWindowDimensions()
  if (smallScreen && showSelectForSmallScreen) {
    return (
      <div className="mb-4">
        <SelectSimple
          {...{ options, value, onChange }}
          components={{ IndicatorSeparator: () => null }}
        />
      </div>
    )
  }
  return (
    <div className={cn('flex border-b border-gray-300', containerClassName)}>
      {options.map(({ label, value: val }) => (
        <button
          key={val}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            'border-b-2 -mb-px',
            {
              'border-[var(--primary)] text-[var(--primary)]': val === value,
              'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300': val !== value,
            }
          )}
          onClick={() => onChange(val)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default PageTabs
