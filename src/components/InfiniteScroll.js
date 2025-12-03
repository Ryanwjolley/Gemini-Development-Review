import { resultsPageSize } from '@shared'
import { cloneElement, forwardRef, useEffect, useRef } from 'react'

const InfiniteScroll = forwardRef(
  (
    {
      onNextPage = null, // pageNum => pageNum,
      onReachedBottom = null, // () => {}.  use this if not using onNextPage (paging managed outside this component)
      disabled,
      total,
      pageSize = resultsPageSize,
      children,
    },
    ref
  ) => {
    const pageNum = useRef(0)
    const scrollContainerRef = useRef()
    const onLastPage = useRef(false)

    useEffect(() => {
      if (!scrollContainerRef.current) return

      const handleScroll = e => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        onLastPage.current = pageNum.current * pageSize >= total
        const reachedBottom = clientHeight >= scrollHeight - scrollTop
        // reached bottom of page, scroll some more
        // thanks https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
        if (onNextPage && !onLastPage.current && !disabled && reachedBottom) {
          pageNum.current += 1
          onNextPage(pageNum.current)
        }
        if (onReachedBottom && reachedBottom) {
          onReachedBottom()
        }
      }

      const scRef = scrollContainerRef.current // linty made me store this into a var
      scRef.addEventListener('scroll', handleScroll)
      return () => {
        scRef.removeEventListener('scroll', handleScroll)
      }
    }, [
      onNextPage,
      onReachedBottom,
      disabled,
      pageSize,
      total,
      scrollContainerRef,
    ])

    useEffect(() => {
      pageNum.current = 0
    }, [total])

    if (ref) {
      ref.current = scrollContainerRef.current
    }

    return cloneElement(children, { ref: scrollContainerRef })
  }
)

export default InfiniteScroll
