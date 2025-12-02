import _ from 'lodash'
import React, { useState } from 'react'
import { Search, Check } from 'lucide-react'
import { cn, useArrayToggleState } from '../../utils'
import Input from '../Input'
import Button from '../Button'

const FilterManager = ({
  onClose = _.noop,
  onChange = _.noop,
  values = [], // [{ raw: 123.4234234234, pretty: '123.4'}]
  selectedValues: initialSelectedValues,
}) => {
  const [searchVal, setSearchVal] = useState('')
  const [selectedValues, toggleValue, setSelectedValues] = useArrayToggleState(
    initialSelectedValues || values
  )
  const filteredValues = _.filter(values, v =>
    _.includes(_.toLower(v), _.toLower(searchVal))
  )
  const handleClose = () => {
    // cuz it's still mounted, so reset state
    onClose()
    setSearchVal('')
    setSelectedValues(initialSelectedValues || values)
  }

  return (
    <div>
      <div className="mb-2 px-2">
        <Input
          type="text"
          onChange={e => setSearchVal(e.target.value)}
          value={searchVal}
          endAdornment={<Search size={16} />}
        />
      </div>
      <div className="mt-1 mb-2">
        <Button
          variant="link"
          size="sm"
          className="mx-2"
          onClick={() => {
            setSearchVal('')
            setSelectedValues([])
          }}
        >
          Clear All
        </Button>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setSearchVal('')
            setSelectedValues(values)
          }}
        >
          Select All
        </Button>
      </div>
      <div>
        <ul
          className="border-t border-b pt-1"
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: '225px',
            maxWidth: '350px',
          }}
        >
          {_.isEmpty(filteredValues) ? (
            <li className="border-0 py-1 pl-2 whitespace-nowrap cursor-pointer list-none">
              None found
            </li>
          ) : (
            filteredValues.map((value, index) => (
              <li
                key={index}
                className="border-0 py-1 pl-2 cursor-pointer flex list-none"
                onClick={() => toggleValue(value)}
              >
                <div>
                  <Check
                    size={16}
                    className={cn('mr-2', {
                      'text-white': !_.includes(selectedValues, value),
                    })}
                  />
                </div>
                <div>{value || '[Empty]'}</div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="mt-1 pt-2">
        <Button variant="danger" size="sm" className="mx-2" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          size="sm"
          disabled={_.isEmpty(selectedValues)}
          onClick={() => {
            onChange(selectedValues)
            onClose()
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}

export default FilterManager
