import { useState, useEffect, forwardRef, useRef } from 'react'
import _ from 'lodash'

export const useRemainingWindowHeight = () => {
  const [height, setHeight] = useState(0)
  const elementRef = useRef()
  useEffect(() => {
    const waitTime = 300
    let timer
    const updateHeight = () => {
      if (!elementRef.current) return
      const newHeight =
        window.innerHeight - elementRef.current.getBoundingClientRect().top
      if (newHeight !== height) {
        setHeight(newHeight)
      }
    }
    const handleChange = () => {
      // don't want to continually re-render as resizing so do this debounce-like thing
      clearTimeout(timer)
      timer = setTimeout(updateHeight, waitTime)
    }

    window.addEventListener('resize', handleChange)
    window.addEventListener('orientationchange', handleChange)

    updateHeight()
    return () => {
      window.removeEventListener('resize', handleChange)
      window.removeEventListener('orientationchange', handleChange)
    }
  }, [height])
  let scrollbarYisVisible = false
  let scrollbarXisVisible = false
  if (elementRef.current) {
    scrollbarYisVisible = elementRef.current.scrollHeight > height
    scrollbarXisVisible =
      elementRef.current.scrollWidth >
      elementRef.current.getBoundingClientRect().width
  }

  return [{ height, scrollbarYisVisible, scrollbarXisVisible }, elementRef]
}

const FillVerticalDiv = forwardRef(
  (
    {
      bottomOffset = 0, // to take into account padding on the page
      getStyle = style => style,
      children,
      ...props
    },
    ref
  ) => {
    const [{ height, scrollbarYisVisible, scrollbarXisVisible }, elementRef] =
      useRemainingWindowHeight()

    return (
      <div
        ref={r => {
          elementRef.current = r
          if (ref) {
            ref.current = r
          }
        }}
        style={getStyle({ height: height - bottomOffset, overflow: 'auto' })}
        {...props}
      >
        {_.isFunction(children)
          ? children({
              height,
              scrollbarYisVisible,
              scrollbarXisVisible,
              fillVerticalDivElem: elementRef.current,
            })
          : children}
      </div>
    )
  }
)

export default FillVerticalDiv
