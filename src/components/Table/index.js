import { useState, useRef, useEffect, Fragment } from 'react'
import _ from 'lodash'
import { cn } from '../../utils'
import { ArrowUp, ArrowDown, ArrowUpDown, Filter, Search } from 'lucide-react'
import Dropdown from '../Dropdown'
import FilterManager from './FilterManager'
import DownloadBtn from './DownloadBtn'
import useTableSettings, {
  sortOrders,
  defaultTableSettings,
} from './useTableSettings'
import Input from '../Input'

export { sortOrders }
/*
<Table
  rowKey={record => record.id}
  columns={[{ 
    key: 'id', 
    header: 'Some ID',
    style: {},
    render: ({ id }) => <div>{id}</div>
  }]}
  data={[{ id: '123' }]}
/>
*/

// let tableIds = {
//   finishedIds
// }

const columnDefaults = ({
  render,
  renderExport,
  dontExport,
  showFilter = false,
  showSort,
  getValue: getValueParam,
  header,
  renderHeader,
  align,
  ...col
}) => {
  const getValue = getValueParam || (data => _.get(data, col.key))

  return {
    key: '',
    header,
    renderHeader: renderHeader || (() => header),
    style: {},
    className: align === 'right' ? 'text-right' : '',
    render: render || getValue,
    renderExport: renderExport || render || getValue,
    showSort: !_.isUndefined(showSort) ? showSort : !dontExport,
    showFilter: !_.isUndefined(showFilter) ? showFilter : !dontExport,
    dontExport,
    getValue,
    align,
    ...col,
  }
}

const sortFilterContainerOffset = 29
const overflowSpaceFixAmount = 30

const Table = ({
  tableId = null,
  noFixedHeader = false,
  containerClassName = '',
  className = 'text-sm',
  variant = 'regular', // 'regular' or 'bordered'
  rowKey = record => record.id,
  columns: columnsParam,
  totalRowData,
  headerCellClassName = '',
  getRowClassName = (/*record, index*/) => '',
  getRowStyle = (/*record, index*/) => ({}),
  renderTotalRowCell = (val, index, column) => (
    <th style={column?.totalRowStyle}>{val}</th>
  ),
  renderTotalRowCellExport = val => val,
  data,
  emptyText = 'No data found.',
  showSearchBar = false,
  searchBarPrepend = null,
  searchBarAppend = null,
  // use fileExport = false to not show/use file export
  fileExport = {
    filename: () => 'export.csv',
  },
  noSort = false,
  initialSorts = defaultTableSettings.sorts,
  searchPlaceholder = '',
  searchKeys = [],
  filteredDataRef = filteredData => filteredData,
  onFilterChange = (colIndex, filteredValues) => [colIndex, filteredValues],
  onSortChange = () => Promise.resolve(), // (sortSettings, column) => Promise
  sortDisabled = false,
}) => {
  const overflowSpaceFix = noSort ? 0 : overflowSpaceFixAmount
  const columns = columnsParam.map(c => {
    const col = columnDefaults(c)
    return col
  })
  const [searchValue, setSearchValue] = useState('')
  const { loading, filters, sorts, setState } = useTableSettings({
    tableId,
    initialSorts,
    columns,
  })

  const [headerColumnWidths, setHeaderColumnWidths] = useState([])
  const [containerWidth, setContainerWidth] = useState(0)
  const [showFixedHeader, setShowFixedHeader] = useState(false)
  const [filterColIndex, setFilterColIndex] = useState(null)
  const [hoveredColIndex, setHoveredColIndex] = useState(null)
  const previousWidths = useRef()
  const containerRef = useRef()
  const mainTableRef = useRef()
  const fixedHeaderRef = useRef()
  const headerColumnRefs = useRef([])
  const measureWidths = () => {
    if (!_.every(headerColumnRefs.current)) return // may not be rendered in DOM yet

    const newWidths = headerColumnRefs.current.map(col => col.clientWidth)
    if (!_.isEqual(previousWidths.current, newWidths)) {
      previousWidths.current = newWidths
      setHeaderColumnWidths(newWidths)
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth)
      }
    }
  }
  useEffect(() => {
    measureWidths()
  })
  useEffect(() => {
    const handleScroll = () => {
      if (!mainTableRef.current) return // in case not mounted.  Seems like that happens sometimes 🤷‍♂️
      const { top, height } = mainTableRef.current.getBoundingClientRect()
      const headerHeight = headerColumnRefs.current[0].clientHeight
      // show fixed header when table reaches top of page and
      // for as long as the table is still in view
      setShowFixedHeader(
        top + overflowSpaceFix - sortFilterContainerOffset < 0 &&
          -top + headerHeight < height
      )
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', measureWidths)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', measureWidths)
    }
  }, [overflowSpaceFix])

  if (_.isEmpty(data)) {
    return <div className="text-center">{emptyText}</div>
  }

  const filtered = _.filter(data, object => {
    const searchOk =
      !searchValue ||
      _.some(searchKeys, key =>
        _.includes(_.toLower(object[key]), _.toLower(searchValue))
      )

    const filtersOk = _.every(filters, ({ values }, colIndex) => {
      const value = columns[colIndex].renderExport(object)
      return _.includes(values, value)
    })
    return searchOk && filtersOk
  })
  filteredDataRef(filtered)

  const orderedData = noSort
    ? filtered
    : _.orderBy(
        filtered,
        _.map(
          sorts,
          ({ index }) =>
            record =>
              columns[index]?.getValue(record)
        ),
        _.map(sorts, ({ order }) => order)
      )

  const headerRow = ({ widths, refs } = {}) => {
    return columns.map((col, index) => {
      const filterValues = _.get(filters, [index, 'values'])
      const hasFilter = !_.isEmpty(filterValues)
      const sortOrder = (_.find(sorts, { index }) || {}).order
      const hasSort = !!sortOrder && !noSort
      const isHovered = hoveredColIndex === index

      return (
        <th
          key={index}
          className={cn(
            headerCellClassName,
            !headerCellClassName && col.className
          )}
          style={col.style}
        >
          <div
            ref={ref => {
              if (refs) {
                refs.current[index] = ref
              }
            }}
            className={cn('flex items-center gap-2', {
              'justify-end': col.align === 'right',
            })}
            style={{
              width: !widths ? undefined : `${widths[index]}px`,
            }}
            onMouseEnter={() => setHoveredColIndex(index)}
            onMouseLeave={() => setHoveredColIndex(null)}
          >
            {col.showSort && !noSort ? (
              <button
                type="button"
                className="flex items-center gap-2 outline-none transition-colors group"
                disabled={sortDisabled}
                onClick={async () => {
                  if (hasSort) {
                    const updatedSortSettings = [
                      {
                        index,
                        order:
                          sortOrder === sortOrders.asc
                            ? sortOrders.desc
                            : sortOrders.asc,
                      },
                    ]
                    await onSortChange(updatedSortSettings, col)
                    setState({ sorts: updatedSortSettings })
                  } else {
                    const updatedSortSettings = [
                      { index, order: sortOrders.asc },
                    ]
                    await onSortChange(updatedSortSettings, col)
                    setState({ sorts: updatedSortSettings })
                  }
                }}
              >
                <span>{col.renderHeader()}</span>
                {hasSort && sortOrder === sortOrders.asc ? (
                  <ArrowUp
                    size={14}
                    className="text-[var(--primary)] opacity-100"
                  />
                ) : hasSort && sortOrder === sortOrders.desc ? (
                  <ArrowDown
                    size={14}
                    className="text-[var(--primary)] opacity-100"
                  />
                ) : (
                  <ArrowUpDown
                    size={14}
                    className={cn('text-gray-400 transition-opacity', {
                      'opacity-0 group-hover:opacity-100': !hasSort,
                    })}
                  />
                )}
              </button>
            ) : (
              <span>{col.renderHeader()}</span>
            )}
            {col.showFilter && (
              <Dropdown
                closeOnOutsideClick={false}
                trigger={(toggleDropdown, willClose) => (
                  <button
                    type="button"
                    className={cn(
                      'outline-none transition-all text-xs',
                      hasFilter
                        ? 'text-[var(--primary)] opacity-100'
                        : 'text-gray-400 opacity-0 hover:opacity-100',
                      (isHovered || hasFilter) && 'opacity-100'
                    )}
                    onClick={e => {
                      setFilterColIndex(willClose ? null : index)
                      toggleDropdown(e)
                    }}
                  >
                    <Filter size={14} />
                  </button>
                )}
              >
                {toggleDropdown => {
                  const filterValueOptions = _(data)
                    .map(data => col.renderExport(data))
                    .uniq()
                    .sortBy()
                    .value()

                  return (
                    <FilterManager
                      onClose={() => {
                        toggleDropdown()
                        setFilterColIndex(null)
                      }}
                      onChange={filteredValues => {
                        if (
                          _.isEmpty(filteredValues) ||
                          filteredValues.length === filterValueOptions.length
                        ) {
                          setState(prev => ({
                            ...prev,
                            filters: _.pickBy(
                              prev.filters,
                              (_f, key) => key !== _.toString(index)
                            ),
                          }))
                        } else {
                          setState(prev => ({
                            ...prev,
                            filters: {
                              ...prev.filters,
                              [index]: {
                                header: col.header,
                                values: filteredValues,
                              },
                            },
                          }))
                        }
                        onFilterChange(index, filteredValues)
                      }}
                      selectedValues={filterValues}
                      values={filterValueOptions}
                    />
                  )
                }}
              </Dropdown>
            )}
          </div>
        </th>
      )
    })
  }

  const downloadBtnProps = {
    overflowSpaceFix,
    fileExport,
    renderTotalRowCellExport,
    data: orderedData,
    totalRowData,
    columns,
  }

  const tableClassName = cn(
    'table',
    { 'table-bordered': variant === 'bordered' },
    className
  )

  return loading ? null : (
    <div
      className={containerClassName}
      ref={containerRef}
      onScroll={e => {
        // keep fixed header scroll position in sync
        fixedHeaderRef.current &&
          fixedHeaderRef.current.scrollTo(e.target.scrollLeft, 0)
      }}
    >
      {showSearchBar && (
        <div className="mb-4 pb-2 flex items-center gap-2">
          {searchBarPrepend}
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            endAdornment={<Search size={16} />}
          />
          {searchBarAppend}
        </div>
      )}

      <div className="relative">
        {!noFixedHeader && (
          <div
            ref={fixedHeaderRef}
            style={{
              position: 'fixed',
              // just render off screen when "hidden", cuz
              // if it's not rendered in the DOM its scroll
              // position won't stay in sync with the regular container
              top: showFixedHeader ? '64px' : '-2000px', // 64px is AppHeader height
              background: 'white',
              zIndex: 30,
              marginTop: `-${overflowSpaceFix - sortFilterContainerOffset}px`,
              paddingTop: `${overflowSpaceFix}px`,
              width: `${containerWidth}px`,
              overflow: 'hidden',
            }}
          >
            {fileExport && <DownloadBtn {...downloadBtnProps} />}
            <table className={`${tableClassName} mb-0`}>
              <thead>
                <tr>{headerRow({ widths: headerColumnWidths })}</tr>
              </thead>
            </table>
          </div>
        )}

        {fileExport && !showFixedHeader && (
          <DownloadBtn {...downloadBtnProps} />
        )}
        <div
          className={cn('w-full', { 'overflow-auto': !noFixedHeader })} // overflow auto causes dropdowns inside the table to not display completely, so this helped
          ref={mainTableRef}
          style={{
            marginTop: `-${overflowSpaceFix}px`,
            paddingTop: `${overflowSpaceFix}px`,
          }}
        >
          <table className={tableClassName}>
            <thead>
              <tr>{headerRow({ refs: headerColumnRefs })}</tr>
            </thead>
            <tbody>
              {!_.isEmpty(totalRowData) && (
                <tr>
                  {totalRowData.map((val, trdIndex) => (
                    <Fragment key={trdIndex}>
                      {renderTotalRowCell(val, trdIndex, columns[trdIndex])}
                    </Fragment>
                  ))}
                </tr>
              )}
              {orderedData.map((record, rowIndex) => {
                return (
                  <tr
                    key={rowKey(record, rowIndex)}
                    style={getRowStyle(record, rowIndex)}
                    className={getRowClassName(record, rowIndex)}
                  >
                    {columns.map((c, colIndex) => (
                      <td
                        key={colIndex}
                        className={c.className || ''}
                        style={c.style}
                      >
                        {c.render
                          ? c.render(record, rowIndex, colIndex)
                          : record[c.key]}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Table
