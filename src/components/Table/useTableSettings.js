import _ from 'lodash'
import { useState, useEffect, useRef } from 'react'
import { useSetState } from '../../utils'

// if wanting to save settings in DB, add these functions in fire.js
const saveTableSettings = _.noop
const getTableSettings = _.noop

const cache = {
  // 'table-id': {...settings}
}

export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
}

export const defaultTableSettings = {
  sorts: [
    {
      index: 0,
      order: sortOrders.asc,
    },
  ],
  // have header and index, cuz when filtering first
  // look for header, then use index if header isn't found.
  // this makes it so it is less likely to break if header names
  // change or columns move around.  maybe do that with sorts if sorting with more than one column someday 🤷‍♀️

  // filters: {
  //   0: {
  //     header: 'Some Header',
  //     values: ['one', 'two', 'three']
  //   },
  // },
  filters: {},
}

const initializeFilters = ({ filters, columns }) =>
  _.transform(filters, (acc, props, colIndex) => {
    const headerIndex = _.findIndex(columns, c => c.header === props.header)

    if (headerIndex === -1) {
      // do this in case header name changed
      acc[colIndex] = { ...props, header: columns[colIndex].header }
    } else {
      // do this in case column header moved position,
      // if it didn't moved position, it'll work too
      acc[headerIndex] = props
    }
  })

const useTableSettings = ({
  tableId = 'test-table-id',
  columns,
  initialSorts = defaultTableSettings.sorts,
}) => {
  const [loading, setLoading] = useState(true)
  const [settings, setState] = useSetState({
    loaded: false,
    ...defaultTableSettings,
    sorts: initialSorts,
  })
  const { filters, sorts } = settings
  const settingsRef = useRef()
  const canSaveRef = useRef()
  const getSettings = async () => {
    if (!tableId) {
      // don't bother trying to load or save settings if no ID
      setLoading(false)
      return
    }
    if (cache[tableId]) {
      setState({
        sorts: initialSorts,
        loaded: true,
        ...cache[tableId],
      })
    } else {
      const result = await getTableSettings({ tableId })
      if (result) {
        settingsRef.current = {
          sorts: result.sorts || initialSorts,
          filters: initializeFilters({ filters: result.filters, columns }),
        }
        cache[tableId] = settingsRef.current
        setState({ ...settingsRef.current, loaded: true })
      } else {
        setState({ loaded: true })
      }
    }
    setLoading(false)
  }
  const getSettingsRef = useRef()
  getSettingsRef.current = getSettings

  useEffect(() => {
    getSettingsRef.current()
  }, [])

  useEffect(() => {
    cache[tableId] = settings
  })
  useEffect(() => {
    if (!canSaveRef.current) {
      if (settings.loaded) {
        canSaveRef.current = true
      }
    } else if (tableId) {
      saveTableSettings({
        tableId,
        ...settings,
      })
    }
  }, [tableId, settings])

  return { loading, filters, sorts, setState }
}

export default useTableSettings
