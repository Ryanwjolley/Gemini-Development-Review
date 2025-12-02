import { useRef, useState } from 'react'
import api from '../api'
import toast from './Toast'

const defaultMapResults = (text, results) => results

export const useSearchAsYouType = ({
  apiUrl,
  mapResults = defaultMapResults,
  searchProps = {},
}) => {
  const [searching, setSearching] = useState('')
  const [results, setResults] = useState([])
  const [hasSearchedOnce, setHasSearchedOnce] = useState()
  const latestSearchText = useRef()
  // could debounce this if too many requests, but elasticsearch seems to do great with a request for every character typed
  const search = async text => {
    if (!text) return
    try {
      setHasSearchedOnce(true)
      setSearching(true)

      latestSearchText.current = text

      const { results: res } = await api(apiUrl, { text, ...searchProps })

      if (latestSearchText.current === text) {
        // do this in case search results come out of order and only latest search updates the results
        setResults(mapResults(text, res))
      }
    } catch (e) {
      toast.error(`${e}`, { toastId: apiUrl }) // unique toast ID prevents duplicates
    }
    setSearching(false)
  }

  const reset = () => setResults([])

  return { search, searching, results, reset, hasSearchedOnce }
}
