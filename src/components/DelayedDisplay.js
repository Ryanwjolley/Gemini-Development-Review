import { useState, useEffect, useRef } from 'react'

const DelayedDisplay = ({ time = 1000, children }) => {
  const [show, setShow] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setShow(true)
    }, time)

    return () => {
      window.clearTimeout(timerRef.current)
    }
  })

  return show ? children : null
}

export default DelayedDisplay
