import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import ReactSelectAsync from 'react-select/async'
import ReactSelect, { components, createFilter } from 'react-select'
import { CheckSquare } from 'lucide-react'
import toast from './Toast'
export const matchFromStart = createFilter({ matchFrom: 'start' })

const selectAllValue = '<______________>' // used like an ID so make it unique/cockeyed like this
const SelectAllLabel = () => (
  <span className="flex items-center gap-2">
    <CheckSquare size={16} />
    Select All
  </span>
)

const SingleValueRenderer = ({ children, ...props }) => {
  // this will make it so you can copy the text of the selected value
  // thanks man - https://stackoverflow.com/a/67589306/4043955
  return (
    <components.SingleValue {...props} onMouseDown={e => e.stopPropagation()}>
      {children}
    </components.SingleValue>
  )
}

const getCustomControlStyle = ({ base, hasError, state }) => ({
  ...base,
  boxShadow: state.isFocused ? 0 : 0,
  backgroundColor: state.isDisabled ? '#e9ecef' : undefined,
  borderColor: state.isFocused
    ? 'var(--primary)'
    : hasError
    ? 'var(--danger)'
    : 'var(--gray-400)',
  '&:hover': {
    borderColor: state.isFocused
      ? 'var(--primary)'
      : hasError
      ? 'var(--danger)'
      : 'var(--gray-400)',
  },
})

const getStyles = ({
  hasError,
  styles: { control = undefined, ...moreStyleFns } = {},
}) => ({
  singleValue: base => ({
    ...base,
    color: 'var(--gray-dark)',
  }),
  placeholder: base => ({ ...base, whiteSpace: 'nowrap' }),
  menu: base => ({ ...base, zIndex: 1000 }),
  control: (base, state) => {
    const customStyle = getCustomControlStyle({ base, hasError, state })
    return control ? control(customStyle, state) : customStyle
  },
  ...moreStyleFns,
})

export const SelectAsync = ({
  value,
  disabled,
  hasError,
  onChange,
  getRef = _.noop,
  styles = {},
  isMulti,
  renderMenuInPortal = false,
  loadOptions,
  loadInitialSelectedOptions,
  minCharsToSearch = 0,
  cacheOptions = true,
  selectableTextEnabled = true,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('')
  const [internalValue, setInternalValue] = useState(null)
  const [initialOptions, setInitialOptions] = useState([])
  const [loadingInitialOptions, setLoadingInitialOptions] = useState(null)

  const loadedInitialOptionsRef = useRef()
  useEffect(() => {
    if (!loadedInitialOptionsRef.current && loadInitialSelectedOptions) {
      loadedInitialOptionsRef.current = true
      setLoadingInitialOptions(true)
      loadInitialSelectedOptions()
        .then(opts => {
          setInitialOptions(opts)
          // prefer the full option object (so any extra fields like vpStatus are preserved)
          const findOption = val => {
            const opt = _.find(opts, { value: val })
            return opt || { value: val, label: opt ? opt.label : val }
          }

          const newInternalValue = isMulti
            ? _.map(value, v => findOption(v))
            : value
            ? findOption(value)
            : null

          setInternalValue(newInternalValue)
        })
        .catch(e => toast.error(e.message))
        .then(() => setLoadingInitialOptions(false))
    }
  }, [loadInitialSelectedOptions, value, isMulti])

  const typeToSearchValue = '[_______]' // just a placeholder to show user they can type to search
  const hasTooFewChars =
    minCharsToSearch > 0 && inputValue.length < minCharsToSearch
  return (
    <ReactSelectAsync
      isDisabled={disabled}
      ref={getRef}
      className="col px-0 bg-white"
      {...(renderMenuInPortal && {
        menuPosition: 'fixed',
        menuPortalTarget: document.body,
      })}
      isMulti={isMulti}
      {...(!inputValue.length && { menuIsOpen: false })}
      {...(loadInitialSelectedOptions && {
        defaultOptions: [
          ...initialOptions,
          ...(isMulti && value?.length > 0
            ? [{ value: typeToSearchValue, label: 'Type to search...' }]
            : []),
        ],
      })}
      styles={getStyles({
        hasError,
        styles: {
          ...styles,
          ...(renderMenuInPortal && {
            menuPortal: (base, state) => ({
              ...base,
              zIndex: 2000,
              ...styles.menuPortal?.(base, state),
            }),
          }),
          option: (base, state) => ({
            ...base,
            ...(state.isDisabled && {
              backgroundColor: 'none',
            }),
            ...styles.option?.(base, state),
          }),
        },
      })}
      isOptionDisabled={o => o.value === typeToSearchValue}
      formatOptionLabel={({ label, value }) => {
        if (value === typeToSearchValue) {
          return <div className="text-center">{label}</div>
        }
        return label
      }}
      cacheOptions={cacheOptions}
      loadOptions={hasTooFewChars ? () => Promise.resolve([]) : loadOptions} // could look into debouncing, but elasticsearch seems to do great without
      loadingMessage={() => (hasTooFewChars ? 'Keep typing...' : 'Loading...')}
      onChange={val => {
        setInternalValue(val)
        onChange(
          isMulti ? val.map(o => o.value) : val ? val.value : null,
          val,
          setInternalValue
        )
      }}
      value={internalValue}
      placeholder="-- Type to search & select --"
      {...(loadingInitialOptions && { isDisabled: true, placeholder: '...' })}
      onInputChange={value => setInputValue(value)}
      noOptionsMessage={() =>
        hasTooFewChars ? (
          'Keep typing...'
        ) : inputValue.length === 0 ? (
          !internalValue ? null : (
            'Type to search'
          )
        ) : (
          <>
            <div>No results found</div>
            {/* This message below may be necessary if wanting to do stricter matching, but leave out for now */}
            {/* <DelayedDisplay time={500}>
              <div className="mt-2" style={{ fontSize: '75%' }}>
                <i className="far fa-hand-point-right mr-1" /> Make sure you've
                got a whole word spelled out if you're not seeing what you
                expect.
              </div>
            </DelayedDisplay> */}
          </>
        )
      }
      {...props}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        ...(selectableTextEnabled && { SingleValue: SingleValueRenderer }),
        ...props.components,
      }}
    />
  )
}

export const SelectSimple = ({
  value,
  disabled,
  hasError,
  options,
  onChange,
  getRef = _.noop,
  styles = {},
  isMulti,
  showSelectAll,
  renderMenuInPortal = false,
  selectableTextEnabled = true,
  ...props
}) => {
  const hasGroupedOptions = _.some(options, 'options')
  const flatOptions = hasGroupedOptions
    ? _.flatMap(options, 'options')
    : options
  const getLabel = val =>
    _.chain(flatOptions).find({ value: val }).get('label').value()

  // build the selected value(s) from the full option objects so extra fields like vpStatus
  // are preserved (instead of only {value,label})
  const selectedValue = isMulti
    ? _.map(
        value || [],
        v =>
          _.find(flatOptions, { value: v }) || { value: v, label: getLabel(v) }
      )
    : value
    ? _.find(flatOptions, { value }) || { value, label: getLabel(value) }
    : null

  return (
    <ReactSelect
      isDisabled={disabled}
      ref={getRef}
      className="col px-0 bg-white"
      {...(renderMenuInPortal && {
        menuPosition: 'fixed', // thanks https://stackoverflow.com/questions/59159428/how-can-i-pull-react-selects-drop-down-menu-aboveits-z-index-expansionpanel
        menuPortalTarget: document.body, // gotta have in portal cuz of z-index and absolute position challenges with react-virtual - https://github.com/TanStack/react-virtual/issues/133#issuecomment-1017778866
      })}
      placeholder="-- Select --"
      {...props}
      components={{
        ...(selectableTextEnabled && { SingleValue: SingleValueRenderer }),
        ...props.components,
      }}
      isMulti={isMulti}
      value={selectedValue}
      options={[
        ...(isMulti && showSelectAll
          ? [{ value: selectAllValue, label: <SelectAllLabel /> }]
          : []),
        ...options,
      ]}
      styles={getStyles({
        hasError,
        styles: {
          ...styles,
          ...(renderMenuInPortal && {
            menuPortal: base => ({ ...base, zIndex: 2000 }),
          }),
        },
      })}
      onChange={val => {
        // pass obj as 2nd param in case need label for something, but for most part just value is needed
        if (isMulti) {
          const values = _.map(val, 'value')
          onChange(
            _.includes(values, selectAllValue)
              ? _.map(flatOptions, 'value')
              : values,
            val
          )
        } else {
          onChange(val ? val.value : '', val || {})
        }
      }}
    />
  )
}
