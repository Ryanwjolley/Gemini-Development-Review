import _ from 'lodash'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { format, csvify, switchy, toDate, getById } from '@shared/shared'
import { useState, useEffect, useCallback } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(customParseFormat)

export { format, csvify, switchy, toDate, getById }

// Utility for merging Tailwind CSS classes
export const cn = (...inputs) => {
  return twMerge(clsx(inputs))
}

export const useSetState = initialState => {
  const [state, set] = useState(initialState)
  const setState = useCallback(
    update =>
      _.isFunction(update)
        ? set(update)
        : set(prev => ({ ...prev, ...update })),
    []
  )
  const arrayAdd = useCallback(
    (arrayKey, index, value) => {
      setState(prev => {
        const prevArray = prev[arrayKey]
        return {
          ...prev,
          [arrayKey]: [
            ...prevArray.slice(0, index),
            value,
            ...prevArray.slice(index),
          ],
        }
      })
    },
    [setState]
  )

  const arrayUpdate = useCallback(
    (arrayKey, index, keyOrObj, value) => {
      setState(prev => {
        const prevArray = prev[arrayKey]
        return {
          ...prev,
          [arrayKey]: _.map(prevArray, (thing, i) => {
            return index === i
              ? _.isObject(keyOrObj)
                ? { ...thing, ...keyOrObj }
                : keyOrObj === null
                ? value
                : {
                    ...thing,
                    [keyOrObj]: _.isFunction(value)
                      ? value(thing[keyOrObj])
                      : value,
                  }
              : thing
          }),
        }
      })
    },
    [setState]
  )

  const arraySwap = useCallback(
    (arrayKey, index, otherIndex) => {
      setState(prev => {
        const prevArray = prev[arrayKey]
        const copy = prevArray.slice()
        const val = copy[index]
        const otherVal = copy[otherIndex]

        copy[index] = otherVal
        copy[otherIndex] = val

        return {
          ...prev,
          [arrayKey]: copy,
        }
      })
    },
    [setState]
  )

  const arrayRemove = useCallback(
    (arrayKey, index) => {
      setState(prev => {
        const prevArray = prev[arrayKey]
        return {
          ...prev,
          [arrayKey]: prevArray.filter((v, i) => i !== index),
        }
      })
    },
    [setState]
  )

  return [state, setState, { arrayAdd, arrayUpdate, arraySwap, arrayRemove }]
}

export const useArrayState = initialArray => {
  const [state, setState] = useState(initialArray)
  const update = useCallback((index, keyOrObj, value) => {
    setState(prev =>
      _.map(prev, (thing, i) => {
        return index === i
          ? _.isObject(keyOrObj)
            ? { ...thing, ...keyOrObj }
            : keyOrObj === null
            ? value
            : {
                ...thing,
                [keyOrObj]: _.isFunction(value)
                  ? value(thing[keyOrObj])
                  : value,
              }
          : thing
      })
    )
  }, [])

  const add = useCallback((index, value) => {
    setState(prev => [...prev.slice(0, index), value, ...prev.slice(index)])
  }, [])

  const swap = useCallback((index, otherIndex) => {
    setState(prev => {
      const copy = prev.slice()
      const val = copy[index]
      const otherVal = copy[otherIndex]

      copy[index] = otherVal
      copy[otherIndex] = val

      return copy
    })
  }, [])

  const remove = useCallback(index => {
    setState(prev => prev.filter((v, i) => i !== index))
  }, [])

  return [state, { update, add, swap, remove, set: setState }]
}

export const useArrayToggleState = (initialState = []) => {
  const [state, setState] = useState(initialState)
  const toggle = useCallback(
    value =>
      setState(prev =>
        prev.includes(value)
          ? prev.filter(v => v !== value)
          : prev.concat(value)
      ),
    []
  )
  return [state, toggle, setState]
}

export const useWindowDimensions = () => {
  const [{ innerHeight, innerWidth }, setDimensions] = useState(
    _.pick(window, ['innerHeight', 'innerWidth'])
  )

  useEffect(() => {
    const handleChange = () => {
      setDimensions(_.pick(window, ['innerHeight', 'innerWidth']))
    }
    window.addEventListener('resize', handleChange)
    window.addEventListener('orientationchange', handleChange)
    return () => {
      window.removeEventListener('resize', handleChange)
      window.removeEventListener('orientationchange', handleChange)
    }
  }, [])

  const smallScreen = innerWidth < 768

  return { innerHeight, innerWidth, smallScreen }
}

export const toRelativeUrl = (url = '') =>
  // makes sure we stay on same page and only use relative URLs
  // to redirect to after logging in
  !url ? '/' : _.get(url.replace(/\/{2,}/, '').match(/\/.*/g), 0, '/')

export const watchForAutoReload = ({ hours }) => {
  // if away from the window for so many hours, automatically reload page to maybe help clear up potential memory leaks since right now users are signed in forever to app
  let focusWindowTime
  let focusOutWindowTime
  const handleWindowFocus = () => {
    focusWindowTime = Date.now()
    if (
      dayjs.duration(focusWindowTime - focusOutWindowTime).asHours() >= hours
    ) {
      window.location.reload()
    }
  }
  const handleWindowFocusOut = () => {
    focusOutWindowTime = Date.now()
  }
  focusOutWindowTime = Date.now()
  window.removeEventListener('focus', handleWindowFocus)
  window.removeEventListener('blur', handleWindowFocusOut)
  window.addEventListener('focus', handleWindowFocus)
  window.addEventListener('blur', handleWindowFocusOut)
}
