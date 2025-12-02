// use when cursor jumps in input cuz of manipulating value. see https://stackoverflow.com/a/68928267/4043955
import { useEffect, useRef, useState } from 'react'

const ControlledInput = props => {
  const { value, onChange, ...rest } = props
  const [cursor, setCursor] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const input = ref.current
    if (input) input.setSelectionRange(cursor, cursor)
  }, [cursor, value])

  const handleChange = e => {
    setCursor(e.target.selectionStart)
    onChange && onChange(e)
  }

  return <input ref={ref} value={value} onChange={handleChange} {...rest} />
}

export default ControlledInput
