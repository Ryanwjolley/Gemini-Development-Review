import { useState } from 'react'
import { Search, Check } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import Dropdown from './Dropdown'
import Tooltip from './Tooltip'
import Table from './Table'
import { SelectSimple } from './Select'
import DatePicker from './DatePicker'
import Badge from './Badge'
import Popover from './Popover'
import Dropzone from './Dropzone'
import Modal from './Modal'
import AppHeader from './AppHeader'

const Demo = () => {
  const [selectValue, setSelectValue] = useState('')
  const [selectMultiValue, setSelectMultiValues] = useState([])
  const [date, setDate] = useState(null)

  const demoOptions = [
    { value: 'option1', label: 'Demo Option 1' },
    { value: 'option2', label: 'Demo Option 2' },
    { value: 'option3', label: 'Demo Option 3' },
  ]

  const demoMultiOptions = [
    { value: 'option1', label: 'Demo Option 1' },
    { value: 'option2', label: 'Demo Option 2' },
    { value: 'option3', label: 'Demo Option 3' },
    { value: 'option4', label: 'Demo Option 4' },
    { value: 'option5', label: 'Demo Option 5' },
    { value: 'option6', label: 'Demo Option 6' },
  ]

  const demoTableData = [
    {
      id: '1',
      name: 'Demo Item 1',
      status: 'Active',
      total: 100.0,
      number: 54.36,
      phase: 'Development',
    },
    {
      id: '2',
      name: 'Demo Item 2',
      status: 'Inactive',
      total: 321.0,
      number: 602.22,
      phase: 'Construction',
    },
    {
      id: '3',
      name: 'Demo Item 3',
      status: 'Active',
      total: 1000.0,
      number: 1.56,
      phase: 'Development',
    },
  ]

  const demoTableColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
    { key: 'total', header: 'Total', align: 'right' },
    { key: 'number', header: 'Number', align: 'right' },
    { key: 'phase', header: 'Phase' },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Component Demo</h1>

      {/* Buttons - All Variants */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Button - Solid Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      {/* Buttons - All Variants Outline */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">
          Button - Outline Variants
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" outline>
            Primary
          </Button>
          <Button variant="secondary" outline>
            Secondary
          </Button>
          <Button variant="success" outline>
            Success
          </Button>
          <Button variant="danger" outline>
            Danger
          </Button>
        </div>
      </div>

      {/* Button Sizes */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Button - Sizes</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      {/* Button Loading */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Button - Loading State</h3>
        <Button loading>Loading</Button>
      </div>

      {/* Input - Regular */}
      <div className="flex items-center gap-2 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-3">Input - Regular</h3>
          <Input placeholder="demo" className="max-w-md" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">SelectSimple</h3>
          <div className="max-w-md">
            <SelectSimple
              {...{ value: selectValue, options: demoOptions }}
              onChange={setSelectValue}
              placeholder="-- Select demo --"
            />
          </div>
        </div>
      </div>

      {/* Input - Small */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Input - Small</h3>
        <Input placeholder="demo" className="max-w-md text-sm py-1.5" />
      </div>

      {/* Input with Adornments */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Input - With Icons</h3>
        <div className="space-y-2 max-w-md">
          <Input
            placeholder="demo"
            startAdornment={<Search size={16} />}
          />
          <Input
            placeholder="demo"
            endAdornment={<Check size={16} className="text-[var(--success)]" />}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Dropdown</h3>
        <Dropdown
          trigger={toggleDropdown => (
            <Button onClick={toggleDropdown}>Demo Dropdown</Button>
          )}
        >
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Option 1
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Option 2
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
            Option 3
          </button>
        </Dropdown>
      </div>

      {/* Tooltips */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Tooltip</h3>
        <div className="flex flex-wrap gap-2">
          <Tooltip title="This is a tooltip">
            <Button>Hover Me</Button>
          </Tooltip>
          <Tooltip title="This is a tooltip" placement="top">
            <Button variant="secondary">Top Tooltip</Button>
          </Tooltip>
          <Tooltip title="This is a tooltip" placement="left">
            <Button variant="success">Left Tooltip</Button>
          </Tooltip>
          <Tooltip title="This is a tooltip" placement="right">
            <Button variant="danger">Right Tooltip</Button>
          </Tooltip>
        </div>
      </div>

      {/* Table - Regular */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Table - Regular</h3>
        <Table
          {...{ data: demoTableData, columns: demoTableColumns }}
          // fileExport={false}
        />
      </div>

      {/* Table - Bordered */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Table - Bordered</h3>
        <Table
          {...{ data: demoTableData, columns: demoTableColumns }}
          variant="bordered"
          // fileExport={false}
        />
      </div>

      {/* SelectSimple */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">SelectSimple</h3>
        <div className="max-w-md">
          <SelectSimple
            {...{ value: selectValue, options: demoOptions }}
            onChange={setSelectValue}
            placeholder="-- Select demo --"
          />
        </div>
      </div>
      {/* SelectSimple Multi */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">SelectSimple - Multi</h3>
        <div className="max-w-md">
          <SelectSimple
            {...{ value: selectMultiValue, options: demoMultiOptions }}
            isMulti
            onChange={setSelectMultiValues}
            placeholder="-- Select demo --"
          />
        </div>
      </div>

      {/* DatePicker */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">DatePicker</h3>
        <div className="max-w-md">
          <DatePicker
            {...{ date }}
            onChange={setDate}
            placeholderText="demo"
            isClearable
          />
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Badge - All Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </div>

      {/* Badges - Pill */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Badge - Pill Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge pill>Default</Badge>
          <Badge variant="primary" pill>
            Primary
          </Badge>
          <Badge variant="secondary" pill>
            Secondary
          </Badge>
          <Badge variant="success" pill>
            Success
          </Badge>
          <Badge variant="danger" pill>
            Danger
          </Badge>
        </div>
      </div>

      {/* Popover */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Popover</h3>
        <Popover
          title="Demo Popover"
          placement="bottomLeft"
          trigger={({ setPopoverOpen, ref, ...props }) => (
            <Button
              {...props}
              ref={ref}
              onClick={e => {
                e.stopPropagation()
                setPopoverOpen(prev => !prev)
              }}
            >
              Click for Popover
            </Button>
          )}
          body={() => (
            <div>
              <p>This is a demo popover content.</p>
              <p className="mt-2">It can contain any content you want!</p>
            </div>
          )}
        />
      </div>

      {/* Dropzone */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Dropzone</h3>
        <div className="max-w-md">
          <Dropzone
            onDrop={files => {
              console.log('Files dropped:', files)
            }}
            helpText="Click or drag files here to upload"
            className="py-8 border-2"
          />
        </div>
      </div>

      {/* Modal */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Modal</h3>
        <Modal
          title="Demo Modal"
          trigger={openModal => <Button onClick={openModal}>Open Modal</Button>}
          body={closeModal => (
            <div>
              <p>This is demo modal content.</p>
              <p className="mt-2">You can put any content here!</p>
            </div>
          )}
          footer={closeModal => (
            <>
              <Button onClick={closeModal}>Cancel</Button>
              <Button variant="primary" onClick={closeModal}>
                Save
              </Button>
            </>
          )}
        />
      </div>
    </div>
  )
}

export default Demo
