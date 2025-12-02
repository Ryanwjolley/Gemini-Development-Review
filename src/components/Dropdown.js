import React from 'react'
import _ from 'lodash'
import { cn } from '../utils'
import Popover from './Popover'

const Dropdown = ({
  trigger = null,
  children: allChildren,
  onOutsideClick = _.noop,
  closeOnOutsideClick = true,
  containerClassName = 'p-0 mt-1',
  className = '',
  align = 'left',
  dropup = false,
  bodyContainerStyle = {},
}) => {
  const children = _.isFunction(allChildren)
    ? allChildren
    : _.compact(React.Children.toArray(allChildren)) // normalize to array before compact

  // Calculate placement based on dropup and align
  const getPlacement = () => {
    if (dropup) {
      return align === 'right' ? 'topRight' : 'topLeft'
    }
    return align === 'right' ? 'bottomRight' : 'bottomLeft'
  }

  return (
    <Popover
      width="auto"
      align={false}
      placement={getPlacement()}
      containerClassName={containerClassName}
      onOutsideClick={onOutsideClick}
      closeOnOutsideClick={closeOnOutsideClick}
      bodyContainerStyle={bodyContainerStyle}
      title={null}
      trigger={({ setPopoverOpen, isOpen, setTriggerElement }) =>
        React.cloneElement(
          trigger((e = { stopPropagation: _.noop }) => {
            e.stopPropagation() // need that, probably cuz of handleOutsideClick stuff
            setPopoverOpen(prev => !prev)
          }, isOpen),
          { ref: setTriggerElement }
        )
      }
      bodyContainerClassName=""
      body={closePopover => (
        <div className={cn('min-w-[10rem] py-1 bg-white border border-gray-200 rounded-md shadow-lg static', className)}>
          {_.isFunction(children)
            ? children(closePopover)
            : React.Children.map(children, c =>
                React.cloneElement(c, {
                  onClick: e => {
                    const { keepDropdownOpen } = c.props.onClick?.(e) || {}
                    if (!keepDropdownOpen) {
                      closePopover()
                    }
                  },
                })
              )}
        </div>
      )}
    />
  )
}

export default Dropdown
